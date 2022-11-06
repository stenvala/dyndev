import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablesRouteHomeComponent } from './components/tables-route-home/tables-route-home.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { TablesRouteIndicesComponent } from './components/tables-route-indices/tables-route-indices.component';
import { TablesRouteBrowseComponent } from './components/tables-route-browse/tables-route-browse.component';
import { TablesRouteSchemaComponent } from './components/tables-route-schema/tables-route-schema.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    TablesRouteHomeComponent,
    TablesRouteIndicesComponent,
    TablesRouteBrowseComponent,
    TablesRouteSchemaComponent,
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class TablesModule {}
