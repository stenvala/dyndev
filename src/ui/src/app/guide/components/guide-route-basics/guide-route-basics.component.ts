import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GuideNavService } from '@guide/services';

import hljs from 'highlight.js';

@Component({
  templateUrl: './guide-route-basics.component.html',
  styleUrls: ['./guide-route-basics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideRouteBasicsComponent implements OnInit {
  constructor(private guideNav: GuideNavService) {}

  ngOnInit(): void {
    this.guideNav.setSideNav();
  }

  ngAfterViewInit() {
    hljs.highlightAll();
  }
}
