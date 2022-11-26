import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutRouteComponent } from './components/about-route/about-route.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [AboutRouteComponent],
  imports: [CommonModule, MatCardModule],
})
export class AboutModule {}
