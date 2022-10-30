import { Injectable } from '@angular/core';
import {
  IMappedStore,
  MappedStore,
  IMappedListStore,
  MappedListStore,
  IListStore,
  ListStore,
  IValueStore,
  ValueStore,
} from './state-management-store-types';

@Injectable({
  providedIn: 'root',
})
export class StateManagementStoreFactory {
  constructor() {}

  createMappedStore<T>(): IMappedStore<T> {
    const store = new MappedStore<T>();
    return store;
  }

  createMappedListStore<T>(): IMappedListStore<T> {
    const store = new MappedListStore<T>();
    return store;
  }

  createListStore<T>(): IListStore<T> {
    const store = new ListStore<T>();
    return store;
  }

  createValueStore<T>(value?: T): IValueStore<T> {
    const store = new ValueStore<T>(value);
    return store;
  }
}
