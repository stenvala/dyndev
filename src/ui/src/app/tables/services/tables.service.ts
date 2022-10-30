import { Injectable } from '@angular/core';
import { TablesApiService } from '@gen/apis';
import { TablesStore } from './tables.store';

@Injectable({ providedIn: 'root' })
export class TablesService {
  private areTablesInitialized = false;
  constructor(
    private store: TablesStore,

    private api: TablesApiService
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
}
