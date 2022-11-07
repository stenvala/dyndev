import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GuideNavService } from '@guide/services';

@Component({
  templateUrl: './guide-route-home.component.html',
  styleUrls: ['./guide-route-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideRouteHomeComponent implements OnInit {
  constructor(private guideNav: GuideNavService) {}

  ngOnInit(): void {
    this.guideNav.setSideNav();
  }
}
