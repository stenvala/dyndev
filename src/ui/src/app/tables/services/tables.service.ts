import { Injectable } from '@angular/core';
import { TablesApiService } from '@gen/apis';
import { SideNavService } from '@core/index';
import { TableSchema, TablesStore } from './tables.store';
import { filter, firstValueFrom, map } from 'rxjs';
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

  getTables() {
    if (!this.areTablesInitialized) {
      this.areTablesInitialized = true;
      this.api.getTables().subscribe((tables) => {
        this.store.tables.set(tables.collection.map((i) => i.table));
      });
    }
    return this.store.tables.obs$;
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
            const schemaWithupdate = {
              updated: new Date().getTime(),
              schema,
            };
            this.cs.set<TableSchema>(csKey, schemaWithupdate);
            return schemaWithupdate;
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
      title: 'Tables',
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
