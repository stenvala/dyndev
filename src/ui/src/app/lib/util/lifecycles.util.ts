import { ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";

type Stream<T> = {
  subscribe: (sub: (val: T) => void) => Subscription;
};

export abstract class LifeCyclesUtil {
  private static disposables = new WeakMap<any, (() => void)[]>();

  static sub<T>(
    key: Object | [Object, ChangeDetectorRef],
    stream: Stream<T>,
    callback: (any: T) => void
  ) {
    const disposablesKey = Array.isArray(key) ? key[0] : key;

    if (!this.disposables.has(disposablesKey)) {
      this.disposables.set(disposablesKey, []);
    }
    if (Array.isArray(key)) {
      callback = createCallback(key[1], callback);
    }
    const subscription = stream.subscribe(callback);
    this.disposables
      .get(disposablesKey)
      ?.push(() => subscription.unsubscribe());
  }

  static stop(key: any) {
    if (this.disposables.has(key)) {
      this.disposables.get(key)?.forEach((i) => {
        i();
      });
      this.disposables.delete(key);
    }
  }
}

function createCallback<T>(
  cdr: ChangeDetectorRef,
  callback: (any: T) => void
): (any: T) => void {
  return (any: T) => {
    callback(any);
    cdr.detectChanges();
  };
}
