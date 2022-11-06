import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SideNavService } from '@core/services';

@Component({
  templateUrl: './guide-route-home.component.html',
  styleUrls: ['./guide-route-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideRouteHomeComponent implements OnInit {
  constructor(private sideNavService: SideNavService) {}

  ngOnInit(): void {
    this.sideNavService.sideNav$.next(undefined);
  }
}
