import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GuideNavService } from '@guide/services';

@Component({
  selector: 'app-guide-route-rules',
  templateUrl: './guide-route-rules.component.html',
  styleUrls: ['./guide-route-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuideRouteRulesComponent implements OnInit {

  constructor(private guideNav: GuideNavService) {}

  ngOnInit(): void {
    this.guideNav.setSideNav();
  }

}
