import { Routes } from '@angular/router';
import { TablesRouteBrowseComponent } from '@tables/index';
import { TablesRouteIndicesComponent } from '@tables/index';
import { TablesRouteHomeComponent } from '@tables/index';
import { TablesRouteSchemaComponent } from '@tables/index';
import { GuideRouteHomeComponent } from '@guide/index';
import { SampleAppRouteMainComponent } from '@sample-app/index';

export const ROUTES: Routes = [
  {
    path: 'tables',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: TablesRouteHomeComponent,
  },
  {
    path: 'tables/:table/browse',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: TablesRouteBrowseComponent,
  },
  {
    path: 'tables/:table/indices',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: TablesRouteIndicesComponent,
  },
  {
    path: 'tables/:table/schema',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: TablesRouteSchemaComponent,
  },
  {
    path: 'guide',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: GuideRouteHomeComponent,
  },
  {
    path: 'sample-app',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: SampleAppRouteMainComponent,
  },
];
