import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
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
  constructor(private service: TablesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    LifeCyclesUtil.sub([this, this.cdr], this.service.getTables(), (tables) => {
      this.tables = tables;
    });
    this.service.setTablesToSideNav()
  }

  ngOnDestroy() {
    LifeCyclesUtil.stop(this);
  }
}
