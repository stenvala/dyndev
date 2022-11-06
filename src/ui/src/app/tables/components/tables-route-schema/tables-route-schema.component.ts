import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { RegionalFormattingService } from '@lib/services';
import { LifeCyclesUtil } from '@lib/util';
import { NavigationService } from '@routing/navigation.service';
import { TablesService } from '@tables/services/tables.service';
import { TableSchema } from '@tables/services/tables.store';
import { firstValueFrom } from 'rxjs';

@Component({
  templateUrl: './tables-route-schema.component.html',
  styleUrls: ['./tables-route-schema.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesRouteSchemaComponent implements OnInit {
  schema?: TableSchema;
  updated?: string;
  private table!: string;
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    private tablesService: TablesService,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef,
    private reg: RegionalFormattingService
  ) {}

  ngOnInit(): void {
    this.tablesService.setTablesToSideNav();

    this.table = this.nav.params$.value['table'] as string;
    LifeCyclesUtil.sub(
      [this, this.cdr],
      this.tablesService.getSchema(this.table),
      (schema) => {
        this.schema = schema;
        this.updated = this.reg.defaultRelativeDateTime(schema.updated);
      }
    );
  }

  ngOnDestoy() {
    LifeCyclesUtil.stop(this);
  }

  refresh() {
    firstValueFrom(this.tablesService.getSchema(this.table, true));
  }
}
