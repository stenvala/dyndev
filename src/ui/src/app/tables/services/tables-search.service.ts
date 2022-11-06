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
export class TablesSearchService {
  constructor(
    private store: TablesStore,
    private sideNavService: SideNavService,
    private nav: NavigationService,
    private api: TablesApiService,
    private cs: ControlStateService
  ) {}

  scan(table: string) {
    return this.api.scanTable(table, {});
  }
}
