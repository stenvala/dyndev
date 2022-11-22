import { Injectable } from '@angular/core';
import { TablesApiService } from '@gen/apis';
import { SideNavService } from '@core/index';
import { TableSchema, TablesStore } from './tables.store';
import { filter, firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { NavigationService } from '@routing/navigation.service';
import { ROUTE_MAP } from '@routing/routes.map';
import { ControlStateService } from '@lib/services';

const CS_SCHEMA_KEY_PREFIX = 'TABLE_SCHEMA.';

@Injectable({ providedIn: 'root' })
export class TablesService {
  private areTablesInitialized = false;
  constructor(
    private store: TablesStore,
    private sideNavService: SideNavService,
    private nav: NavigationService,
    private api: TablesApiService,
    private cs: ControlStateService
  ) {}

  getTables(): Observable<string[]> {
    if (!this.areTablesInitialized) {
      this.areTablesInitialized = true;
      return this.api.getTables().pipe(
        tap((tables) => {
          this.store.tables.set(tables.collection.map((i) => i.table));
        }),
        switchMap((i) => this.getTables())
      );
    }
    return this.store.tables.obs$;
  }

  deleteTable(table: string) {
    return this.api.deleteTable(table).pipe(
      tap((i) => {
        this.store.tables.set(
          this.store.tables.obs$.value.filter((i) => i !== table)
        );
        this.store.schemas.clear(table);
        this.cs.remove(CS_SCHEMA_KEY_PREFIX + table);
      })
    );
  }

  getIndices(table: string) {
    return this.store.indices.subscribeToValue(table, () =>
      this.api.indices(table).pipe(map((i) => i.collection))
    );
  }

  getSchema(table: string, reload = false) {
    const csKey = CS_SCHEMA_KEY_PREFIX + table;
    if (!reload && !this.store.schemas.has(table)) {
      const csSchema = this.cs.get<TableSchema>(csKey);
      if (csSchema != null) {
        this.store.schemas.set(table, csSchema);
      }
    }
    return this.store.schemas.subscribeToValue(
      table,
      () =>
        this.api.getTableSchema(table).pipe(
          map((schema) => {
            const schemaWitUpdate = {
              updated: new Date().getTime(),
              schema,
            };
            this.cs.set<typeof schemaWitUpdate>(csKey, schemaWitUpdate);
            return schemaWitUpdate;
          })
        ),
      reload
    );
  }

  async setTablesToSideNav() {
    const tables = await firstValueFrom(
      this.getTables().pipe(filter((i) => i.length > 0))
    );
    const pathParams = this.nav.params$.value;
    this.sideNavService.sideNav$.next({
      title: 'Available tables',
      content: [
        {
          items: tables.map((i) => {
            const subitems =
              pathParams['table'] === i ? this.getTableSubNav() : undefined;
            return {
              label: i,
              action: () => this.selectTable(i),
              subitems,
              // isActive: pathParams['table'] === i,
            };
          }),
        },
      ],
    });
  }

  private selectTable(table: string) {
    this.nav.goto(ROUTE_MAP.TABLES.BROWSE, { table });
  }

  private getTableSubNav() {
    const current = this.nav.activePath$.value.substring(1);
    return [
      {
        label: 'Browse',
        action: () => this.nav.goto(ROUTE_MAP.TABLES.BROWSE),
        isActive: current === ROUTE_MAP.TABLES.BROWSE.PATH.substring(1),
      },
      {
        label: 'Indices',
        action: () => this.nav.goto(ROUTE_MAP.TABLES.INDICES),
        isActive: current === ROUTE_MAP.TABLES.INDICES.PATH.substring(1),
      },
      {
        label: 'Schema',
        action: () => this.nav.goto(ROUTE_MAP.TABLES.SCHEMA),
        isActive: current === ROUTE_MAP.TABLES.SCHEMA.PATH.substring(1),
      },
    ];
  }
}
