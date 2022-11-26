import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideRouteHomeComponent } from './components/guide-route-home/guide-route-home.component';
import { GuideRouteBasicsComponent } from './components/guide-route-basics/guide-route-basics.component';
import { GuideRoutePythonComponent } from './components/guide-route-python/guide-route-python.component';
import { GuideShowCodeComponent } from './components/guide-show-code/guide-show-code.component';
import { MatCardModule } from '@angular/material/card';
import { GuideRouteCdkComponent } from './components/guide-route-cdk/guide-route-cdk.component';
import { GuideRouteRulesComponent } from './components/guide-route-rules/guide-route-rules.component';

@NgModule({
  declarations: [
    GuideRouteHomeComponent,
    GuideRouteBasicsComponent,
    GuideRoutePythonComponent,
    GuideShowCodeComponent,
    GuideRouteCdkComponent,
    GuideRouteRulesComponent,
  ],
  imports: [CommonModule, MatCardModule],
})
export class GuideModule {}
