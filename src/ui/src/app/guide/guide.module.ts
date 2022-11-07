import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideRouteHomeComponent } from './components/guide-route-home/guide-route-home.component';
import { GuideRouteAboutComponent } from './components/guide-route-about/guide-route-about.component';
import { GuideRouteBasicsComponent } from './components/guide-route-basics/guide-route-basics.component';
import { GuideRoutePythonComponent } from './components/guide-route-python/guide-route-python.component';
import { GuideShowCodeComponent } from './components/guide-show-code/guide-show-code.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    GuideRouteHomeComponent,
    GuideRouteAboutComponent,
    GuideRouteBasicsComponent,
    GuideRoutePythonComponent,
    GuideShowCodeComponent,
  ],
  imports: [CommonModule, MatCardModule],
})
export class GuideModule {}
