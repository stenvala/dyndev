import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface CS_VALUE {
  key: string;
  value: any;
}

const PREFIX = 'DYNDEV_CS_VALUE';

@Injectable({
  providedIn: 'root',
})
export class ControlStateService {
  controlStates$ = new Subject<CS_VALUE>();

  constructor() {}

  set<T>(key: string, value: T): void {
    const strValue = JSON.stringify({
      value,
    });
    localStorage.setItem(PREFIX + key, strValue);
    this.controlStates$.next({
      key,
      value,
    });
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    const value = localStorage.getItem(PREFIX + key);
    if (value === null) {
      return defaultValue;
    }
    return JSON.parse(value)['value'];
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
