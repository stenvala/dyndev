import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';

const ID = 'BUSY_LAYER';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  private keys = new Set<string>();
  private element?: ElementRef;
  private isReady$ = new BehaviorSubject<boolean>(false);
  constructor() {}

  setElement(element: ElementRef) {
    if (this.element) {
      // already set
      return;
    }
    this.element = element;
    this.isReady$.next(true);
  }

  waitUntilReady(): Promise<boolean> {
    return firstValueFrom(this.isReady$.pipe(filter((i) => i)));
  }

  show(): string {
    const key = (Math.random() + 1).toString(36).substring(2);
    this.keys.add(key);
    if (this.keys.size == 1) {
      this.element?.nativeElement.classList.remove('busy-hidden');
      this.element?.nativeElement.classList.add('busy-visible');
    }
    return key;
  }

  hide(key?: string) {
    if (!key) {
      this.hideAll();
      return;
    }
    if (!this.keys.has(key)) {
      return;
    }
    this.keys.delete(key);
    if (this.keys.size == 0) {
      this.doHide();
    }
  }

  private hideAll() {
    if (this.keys.size == 0) {
      return;
    }
    this.keys = new Set<string>();
    this.doHide();
  }

  private doHide() {
    this.element?.nativeElement.classList.add('busy-hidden');
    this.element?.nativeElement.classList.remove('busy-visible');
    setTimeout(() => {
      if (this.keys.size == 0) {
        this.element?.nativeElement.classList.remove('busy-hidden');
      }
    }, 500);
  }
}
