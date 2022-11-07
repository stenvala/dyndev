import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GuideApiService } from '@gen/apis';
import { GuideNavService } from '@guide/services';

@Component({
  templateUrl: './guide-route-python.component.html',
  styleUrls: ['./guide-route-python.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideRoutePythonComponent implements OnInit {
  constructor(private guideNav: GuideNavService) {}

  ngOnInit(): void {
    this.guideNav.setSideNav();
  }
}
