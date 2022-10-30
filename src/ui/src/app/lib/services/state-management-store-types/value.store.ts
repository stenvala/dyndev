import { BehaviorSubject } from "rxjs";

export interface IValueStore<T> {
  obs$: BehaviorSubject<T | undefined>;
  set(value: T): void;
  clear(): void;
}

export class ValueStore<T> implements IValueStore<T> {
  obs$: BehaviorSubject<T | undefined>;

  constructor(value?: T) {
    this.obs$ = new BehaviorSubject<T | undefined>(value);
  }

  set(value: T) {
    this.obs$.next(value);
  }

  clear() {
    this.obs$.next(undefined);
  }
}
