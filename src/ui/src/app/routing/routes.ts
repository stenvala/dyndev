import { Routes } from '@angular/router';
import { TablesRouteEditComponent } from '@tables/index';
import { GuideRouteBasicsComponent } from '@guide/index';
import { GuideRouteCdkComponent } from '@guide/index';
import { GuideRouteAboutComponent } from '@guide/index';
import { TablesRouteIndicesComponent } from '@tables/index';
import { TablesRouteBrowseComponent } from '@tables/index';
import { GuideRouteHomeComponent } from '@guide/index';
import { GuideRoutePythonComponent } from '@guide/index';
import { SampleAppRouteShowNotesComponent } from '@sample-app/index';
import { TablesRouteSchemaComponent } from '@tables/index';
import { SampleAppRouteMainComponent } from '@sample-app/index';
import { TablesRouteHomeComponent } from '@tables/index';

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
    path: 'tables/:table/edit/pk/:pkKey/:pk/sk/:skKey/:sk',
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
    path: 'guide/cdk',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: GuideRouteCdkComponent,
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
  {
    path: 'sample-app/category/:categoryId',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: SampleAppRouteShowNotesComponent,
  },
  {
    path: 'sample-app/status/:status',
    canActivate: [],
    canDeactivate: [],
    data: {},
    component: SampleAppRouteShowNotesComponent,
  },
];
