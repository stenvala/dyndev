import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GuideNavService } from '@guide/services';

@Component({
  templateUrl: './guide-route-about.component.html',
  styleUrls: ['./guide-route-about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideRouteAboutComponent implements OnInit {
  constructor(private guideNav: GuideNavService) {}

  ngOnInit(): void {
    this.guideNav.setSideNav();
  }
}
