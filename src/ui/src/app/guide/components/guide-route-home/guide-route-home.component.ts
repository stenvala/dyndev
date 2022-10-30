import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  templateUrl: './guide-route-home.component.html',
  styleUrls: ['./guide-route-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideRouteHomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
