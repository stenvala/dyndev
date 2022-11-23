import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SideNavItem {
  label: string;
  action?: () => void;
  isActive?: boolean;
  subitems?: SideNavItem[];
}

export interface SideNavContent {
  title?: string;
  content: {
    subtitle?: string;
    items: SideNavItem[];
  }[];
}

@Injectable({ providedIn: 'root' })
export class SideNavService {
  sideNav$ = new BehaviorSubject<SideNavContent | undefined>(undefined);

  constructor() {}
}
