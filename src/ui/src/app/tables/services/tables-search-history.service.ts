import { Injectable } from '@angular/core';
import { TableItemsDTO } from '@gen/models';
import { IMappedStore, StateManagementStoreFactory } from '@lib/services';

export enum SearchTypeEnum {
  QUERY = 'QUERY',
  SCAN = 'SCAN',
  SCAN_ALL = 'SCAN_ALL',
}

const MAX_SAVE_SEARCH_LENGTH = 10;

const LS_KEY = 'DYNDEV_TABLES_SEARCH_HISTORY';

export interface SavedSearch {
  type: SearchTypeEnum;
  formValue: any; // Value of the form
  data: TableItemsDTO;
}

@Injectable({ providedIn: 'root' })
export class TablesSearchHistoryService {
  count: IMappedStore<number> = this.sms.createMappedStore<number>();
  private searches: { [key: string]: SavedSearch[] } = {};

  constructor(private sms: StateManagementStoreFactory) {
    const savedState = sessionStorage.getItem(LS_KEY);
    if (savedState !== null) {
      this.searches = JSON.parse(savedState);
      Object.keys(this.searches).forEach((tableName) => {
        this.count.set(tableName, this.searches[tableName].length);
      });
    }
  }

  has(tableName: string) {
    return tableName in this.searches && this.searches[tableName].length > 0;
  }

  init(tableName: string) {
    if (!this.count.has(tableName)) {
      this.count.set(tableName, 0);
      this.searches[tableName] = [];
    } else {
      this.count.set(tableName, this.searches[tableName].length);
    }
  }

  add(tableName: string, search: SavedSearch) {
    if (!(tableName in this.searches)) {
      this.searches[tableName] = [];
    }
    this.searches[tableName].unshift(search);
    if (this.searches[tableName].length > MAX_SAVE_SEARCH_LENGTH) {
      this.searches[tableName].pop();
    }
    this.count.set(tableName, this.searches[tableName].length);
    sessionStorage.setItem(LS_KEY, JSON.stringify(this.searches));
  }

  set(tableName: string, index: number, search: SavedSearch) {
    this.searches[tableName][index] = search;
  }

  get(tableName: string, index: number): SavedSearch {
    return this.searches[tableName][index];
  }

  clear(tableName: string) {
    this.searches[tableName] = [];
    this.count.set(tableName, 0);
    sessionStorage.setItem(LS_KEY, JSON.stringify(this.searches));
  }

  updateItems(tableName: string, index: number, items: Array<object>) {
    this.searches[tableName][index].data.items = items;
    sessionStorage.setItem(LS_KEY, JSON.stringify(this.searches));
  }
}
