import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TablesService } from '@tables/services/tables.service';

@Component({
  selector: 'app-tables-route-indices',
  templateUrl: './tables-route-indices.component.html',
  styleUrls: ['./tables-route-indices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesRouteIndicesComponent implements OnInit {
  constructor(private tablesService: TablesService) {}

  ngOnInit(): void {
    this.tablesService.setTablesToSideNav();
  }
}
