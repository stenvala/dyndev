import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RowSchemaDTO } from '@gen/models';
import { BusyService, ToasterService } from '@lib/services';
import { NavigationService } from '@routing/navigation.service';
import { TablesSearchService, TablesService } from '@tables/services';
import { keySorter } from '@tables/utils';
import { firstValueFrom } from 'rxjs';
declare var require: any;
const stringify = require('json-stable-stringify');

@Component({
  templateUrl: './tables-route-edit.component.html',
  styleUrls: ['./tables-route-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesRouteEditComponent implements OnInit {
  private pkKey!: string;
  private skKey!: string;
  private pkValue!: string;
  private skValue!: string;
  private table!: string;

  value = new FormControl('', Validators.required);
  schema?: RowSchemaDTO;
  constructor(
    private tablesService: TablesService,
    private tablesSearchService: TablesSearchService,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef,
    private busy: BusyService,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.tablesService.setTablesToSideNav();
    this.pkKey = this.nav.params$.value['pkKey'];
    this.skKey = this.nav.params$.value['skKey'];
    this.pkValue = this.nav.params$.value['pk'];
    this.skValue = this.nav.params$.value['sk'];
    this.table = this.nav.params$.value['table'];
    this.load();
  }

  async load() {
    const busyId = this.busy.show();
    const data = await firstValueFrom(
      this.tablesSearchService.get(
        this.table,
        this.pkKey,
        this.pkValue,
        this.skKey,
        this.skValue
      )
    );
    //const keys = Object.keys(data.item).sort();
    const value = stringify(data.item, { cmp: keySorter, space: 2 });
    this.value.setValue(value);

    const schema = await firstValueFrom(
      this.tablesService.getSchema(this.table)
    );
    this.schema = schema.schema.types.find((i: any) => {
      return i.type === (data.item as any)['TYPE'];
    });

    this.cdr.detectChanges();
    this.busy.hide(busyId);
  }

  async save() {
    try {
      await firstValueFrom(
        this.tablesSearchService.save(this.table, JSON.parse(this.value.value))
      );
      this.toaster.showSuccess('Item saved successfully');
    } catch (e) {
      this.toaster.showError('Saving item failed');
    }
  }
}
