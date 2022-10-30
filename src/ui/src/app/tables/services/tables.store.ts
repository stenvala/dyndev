import { Injectable } from '@angular/core';
import { IListStore, StateManagementStoreFactory } from '@lib/index';

@Injectable({ providedIn: 'root' })
export class TablesStore {
  tables: IListStore<string>;

  constructor(sms: StateManagementStoreFactory) {
    this.tables = sms.createListStore<string>();
  }
}
