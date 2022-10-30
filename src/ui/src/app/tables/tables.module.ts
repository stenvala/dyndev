import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablesRouteHomeComponent } from './components/tables-route-home/tables-route-home.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [TablesRouteHomeComponent],
  imports: [CommonModule, MatSidenavModule, MatButtonModule],
})
export class TablesModule {}
