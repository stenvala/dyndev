import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GuideNavService } from '@guide/services';

@Component({
  templateUrl: './guide-route-about.component.html',
  styleUrls: ['./guide-route-about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideRouteAboutComponent implements OnInit {
  private now = new Date().getFullYear();
  until = this.now > 2022 ? `-${this.now}` : '';
  constructor(private guideNav: GuideNavService) {}

  ngOnInit(): void {
    this.guideNav.setSideNav();
  }
}
