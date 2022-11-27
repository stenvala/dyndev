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
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TablesViewGridActionsCellComponent } from './components/tables-view-grid-actions-cell/tables-view-grid-actions-cell.component';
import { TablesRouteEditComponent } from './components/tables-route-edit/tables-route-edit.component';
import { TablesRowSchemaComponent } from './components/tables-row-schema/tables-row-schema.component';
import { TablesDialogViewRowComponent } from './components/tables-dialog-view-row/tables-dialog-view-row.component';

@NgModule({
  declarations: [
    TablesRouteHomeComponent,
    TablesRouteIndicesComponent,
    TablesRouteBrowseComponent,
    TablesRouteSchemaComponent,
    TablesViewGridActionsCellComponent,
    TablesRouteEditComponent,
    TablesRowSchemaComponent,
    TablesDialogViewRowComponent,
  ],
  imports: [
    CommonModule,
    AgGridModule,
    MatSidenavModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
})
export class TablesModule {}
