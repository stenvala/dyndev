import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { SideNavService } from '@core/services';
import { ToasterService } from '@lib/services';
import { LifeCyclesUtil } from '@lib/util';
import { TablesService } from '@tables/services/tables.service';

@Component({
  templateUrl: './tables-route-home.component.html',
  styleUrls: ['./tables-route-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesRouteHomeComponent implements OnInit {
  showFiller = false;
  tables?: string[];
  constructor(
    private service: TablesService,
    private cdr: ChangeDetectorRef,
    private toaster: ToasterService,
    private sideNavService: SideNavService
  ) {}

  ngOnInit(): void {
    LifeCyclesUtil.sub([this, this.cdr], this.service.getTables(), (tables) => {
      this.tables = tables;
      if (this.tables.length === 0) {
        this.toaster.showError('There are no tables in the database.');
        this.sideNavService.sideNav$.next(undefined);
      } else {
        this.service.setTablesToSideNav();
      }
    });
  }

  ngOnDestroy() {
    LifeCyclesUtil.stop(this);
  }
}
