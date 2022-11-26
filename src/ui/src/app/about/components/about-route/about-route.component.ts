import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { SideNavService } from '@core/services';

@Component({
  templateUrl: './about-route.component.html',
  styleUrls: ['./about-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutRouteComponent implements OnInit {
  until = '';
  constructor(
    private sideNavService: SideNavService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sideNavService.sideNav$.next(undefined);
    const year = new Date().getFullYear();
    if (year > 2022) {
      this.until = `-${year}`;
    }
    this.cdr.detectChanges();
  }
}
