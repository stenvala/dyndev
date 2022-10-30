import { BehaviorSubject } from "rxjs";

export interface IListStore<T> {
  obs$: BehaviorSubject<T[]>;

  add(value: T): void;
  add(value: T, sort: boolean): void;
  set(key: T[]): void;
  clear(): void;
  setCompareFun(fun: (a: T, b: T) => number): void;
  setHasValueFun(fun: (item: T, list: T[]) => boolean): void;
}

export class ListStore<T> implements IListStore<T> {
  obs$ = new BehaviorSubject<T[]>([]);

  private hasValueFun = (item: T, list: T[]) => {
    return list.indexOf(item) !== -1;
  };

  private compareFun?: (a: T, b: T) => number;

  constructor() {}

  add(value: T, sort = true) {
    const current = this.obs$.value;
    if (!this.hasValueFun(value, current)) {
      current.push(value);
      if (sort) {
        current.sort(this.compareFun);
      }
      this.obs$.next(current);
    }
  }

  set(values: T[]) {
    this.obs$.next(values);
  }

  clear() {
    this.obs$.next([]);
  }

  setCompareFun(fun: (a: T, b: T) => number): void {
    this.compareFun = fun;
  }

  setHasValueFun(fun: (item: T, list: T[]) => boolean): void {
    this.hasValueFun = fun;
  }
}
