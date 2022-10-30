import { Routes } from '@angular/router';
import { TablesRouteHomeComponent } from '@tables/index';
import { GuideRouteHomeComponent } from '@guide/index';

export const ROUTES: Routes = [
  {
    path: 'tables',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: TablesRouteHomeComponent,
  },
  {
    path: 'guide',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: GuideRouteHomeComponent,
  },
];
