import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SideNavService } from '@core/services';

@Component({
  templateUrl: './sample-app-route-main.component.html',
  styleUrls: ['./sample-app-route-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleAppRouteMainComponent implements OnInit {
  constructor(private sideNavService: SideNavService) {}

  ngOnInit(): void {
    this.sideNavService.sideNav$.next(undefined);
  }
}
