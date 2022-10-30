import {
  filter,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from "rxjs";

export interface MapDataUpdate<T> {
  key: string;
  value: T;
}

export interface IMappedStore<T> {
  obs$: Observable<MapDataUpdate<T>>;
  has(key: string): boolean;
  get(key: string): T;
  set(key: string, value: T): void;
  clear(key?: string): void;
  subscribeToValue(
    key: string,
    fetcher: () => Observable<T>,
    refresh?: boolean
  ): Observable<T>;
}

export class MappedStore<T> implements IMappedStore<T> {
  obs$ = new Subject<MapDataUpdate<T>>();

  private data = new Map<string, T>();

  has(key: string): boolean {
    return this.data.has(key);
  }

  get(key: string): T {
    if (!this.has(key)) {
      throw new Error(`Item with key ${key} is not in store.`);
    }
    return this.data.get(key) as T;
  }

  set(key: string, value: T): void {
    this.data.set(key, value);
    this.obs$.next({
      key,
      value,
    });
  }

  clear(key?: string): void {
    if (key) {
      if (this.has(key)) {
        this.data.delete(key);
      }
    } else {
      const keys = this.data.keys();
      for (let i in keys) {
        this.clear(i);
      }
    }
  }

  subscribeToValue(
    key: string,
    fetcher: () => Observable<T>,
    refresh?: boolean
  ): Observable<T> {
    if (this.has(key) && !refresh) {
      return merge(
        of(this.get(key)),
        this.obs$.pipe(
          filter((i) => i.key === key),
          map((i) => i.value)
        )
      );
    }
    // There is risk of infinite recursion here IF this.set doesn't actually set the value
    return fetcher().pipe(
      tap((i) => this.set(key, i)),
      switchMap((i) => this.subscribeToValue(key, fetcher))
    );
  }
}
