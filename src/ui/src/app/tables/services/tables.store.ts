import { Injectable } from '@angular/core';
import { TableSchemaDTO, TableIndexDTO } from '@gen/index';
import {
  IListStore,
  IMappedStore,
  IMappedListStore,
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
  indices: IMappedListStore<TableIndexDTO>;

  constructor(sms: StateManagementStoreFactory) {
    this.tables = sms.createListStore<string>();
    this.schemas = sms.createMappedStore<TableSchema>();
    this.indices = sms.createMappedListStore<TableIndexDTO>();
  }
}
