import { Routes } from '@angular/router';
import { TablesRouteIndicesComponent } from '@tables/index';
import { TablesRouteSchemaComponent } from '@tables/index';
import { TablesRouteBrowseComponent } from '@tables/index';
import { TablesRouteHomeComponent } from '@tables/index';
import { GuideRouteAboutComponent } from '@guide/index';
import { GuideRouteHomeComponent } from '@guide/index';
import { TablesRouteEditComponent } from '@tables/index';
import { GuideRoutePythonComponent } from '@guide/index';
import { GuideRouteBasicsComponent } from '@guide/index';
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
    path: 'tables/:table/edit/pk/:pk/sk/:sk',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: TablesRouteEditComponent,
  },
  {
    path: 'guide/main',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: GuideRouteHomeComponent,
  },
  {
    path: 'guide/basics',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: GuideRouteBasicsComponent,
  },
  {
    path: 'guide/python',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: GuideRoutePythonComponent,
  },
  {
    path: 'guide/about',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: GuideRouteAboutComponent,
  },
  {
    path: 'sample-app',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: SampleAppRouteMainComponent,
  },
];
