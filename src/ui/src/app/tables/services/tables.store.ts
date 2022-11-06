import { Injectable } from '@angular/core';
import { TableSchemaDTO } from '@gen/index';
import {
  IListStore,
  IMappedStore,
  StateManagementStoreFactory,
} from '@lib/index';

export interface TableSchema {
  updated: number;
  schema: TableSchemaDTO;
}

@Injectable({ providedIn: 'root' })
export class TablesStore {
  tables: IListStore<string>;
  schemas: IMappedStore<TableSchema>;

  constructor(sms: StateManagementStoreFactory) {
    this.tables = sms.createListStore<string>();
    this.schemas = sms.createMappedStore<TableSchema>();
  }
}
