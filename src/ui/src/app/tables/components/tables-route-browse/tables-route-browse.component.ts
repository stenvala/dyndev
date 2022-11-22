import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FilterConditionEnum, TableQueryRequestDTO } from '@gen/models';
import { NavigationService } from '@routing/navigation.service';
import {
  SearchTypeEnum,
  TablesSearchHistoryService,
  TablesSearchService,
  TablesService,
} from '@tables/services';
import { filter, firstValueFrom, map } from 'rxjs';
import {
  CellKeyPressEvent,
  ColDef,
  ICellRendererParams,
} from 'ag-grid-community';
import * as XLSX from 'xlsx';
import {
  BusyService,
  ControlStateService,
  ToasterService,
} from '@lib/services';
import { FormBuilder, Validators } from '@angular/forms';
import { TablesViewGridActionsCellComponent } from '../tables-view-grid-actions-cell/tables-view-grid-actions-cell.component';
import { LifeCyclesUtil } from '@lib/util';

interface ComponentState {
  isScanOpen: boolean;
  isQueryOpen: boolean;
}
const CS_KEY = 'TABLE_ROUTES_STATE';
const PK_VALUES = [
  'PK',
  ...Array.apply(null, Array(5)).map((val, i) => `GSI${i + 1}PK`),
];

@Component({
  templateUrl: './tables-route-browse.component.html',
  styleUrls: ['./tables-route-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesRouteBrowseComponent implements OnInit {
  rowData?: object[];
  colDefs?: ColDef[];
  state!: ComponentState;
  readonly pkValues = PK_VALUES;
  types: string[] = [];
  queryForm = this.fb.group({
    selectedPK: 'PK',
    selectedPKValue: ['', Validators.required],
    selectedSK: [FilterConditionEnum.BEGINS_WITH],
    selectedSKValue: '',
  });
  scanForm = this.fb.group({
    selectedType: '',
  });
  matchOptions = [FilterConditionEnum.BEGINS_WITH, FilterConditionEnum.EQ];

  currentSearch = 0;
  searchCount = 0;

  private table!: string;
  constructor(
    private tablesService: TablesService,
    private tablesSearchService: TablesSearchService,
    private tablesSearchHistoryService: TablesSearchHistoryService,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef,
    private cs: ControlStateService,
    private busy: BusyService,
    private toaster: ToasterService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.state = this.cs.get<ComponentState>(CS_KEY, {
      isScanOpen: false,
      isQueryOpen: false,
    })!;
    this.tablesService.setTablesToSideNav();
    LifeCyclesUtil.sub(
      [this, this.cdr],
      this.tablesSearchHistoryService.count.obs$.pipe(
        filter((i) => i.key === this.table),
        map((i) => i.value)
      ),
      (count) => (this.searchCount = count)
    );
    LifeCyclesUtil.sub([this, this.cdr], this.nav.params$, async (params) => {
      this.table = params['table'] as string;
      if (this.table) {
        this.queryForm.patchValue({
          selectedPK: 'PK',
          selectedPKValue: '',
          selectedSKValue: '',
        });
        this.tablesSearchHistoryService.init(this.table);
        this.tablesService.setTablesToSideNav();
        await this.solveTypes();
        if (this.tablesSearchHistoryService.has(this.table)) {
          this.populateSearchResultsFromIndex(0);
        } else {
          this.rowData = undefined;
        }
      }
    });
  }

  ngOnDestroy() {
    LifeCyclesUtil.stop(this);
  }

  populateSearchResultsFromIndex(index: number) {
    const results = this.tablesSearchHistoryService.get(this.table, index);
    if (results.type === SearchTypeEnum.QUERY) {
      this.queryForm.patchValue(results.formValue);
    } else {
      this.scanForm.patchValue(results.formValue);
    }
    this.currentSearch = index;
    this.displayResult(results.data.items);
  }

  clearSearchHistory() {
    this.tablesSearchHistoryService.clear(this.table);
    this.rowData = undefined;
    this.cdr.detectChanges();
  }

  private async solveTypes() {
    // get types
    const schema = await firstValueFrom(
      this.tablesService.getSchema(this.table)
    );
    this.types = schema.schema.types.map((i) => i.type);
    if (this.types.length > 0) {
      this.scanForm.controls['selectedType'].setValue(this.types[0]);
    }
    this.cdr.detectChanges();
  }

  toggleExpansionPanel(
    kind: 'isScanOpen' | 'isQueryOpen',
    isExpanded: boolean
  ) {
    this.state[kind] = isExpanded;
    this.cs.set(CS_KEY, this.state);
  }

  async query() {
    const request: TableQueryRequestDTO = {
      pk: this.queryForm.controls['selectedPK'].value,
      pkValue: this.queryForm.controls['selectedPKValue'].value,
    };
    const pk = this.queryForm.controls['selectedPK'].value;
    let sk = 'SK';
    if (pk !== 'PK') {
      sk = pk.replace('PK', 'SK');
      request.indexName = pk.replace('PK', '');
    }
    const skValue = this.queryForm.controls['selectedSKValue'].value;
    if (skValue) {
      request.sk = sk;
      request.skValue = skValue;
      request.skCondition = this.queryForm.controls['selectedSK'].value;
    }
    this.busy.show();
    const result = await firstValueFrom(
      this.tablesSearchService.query(this.table, request)
    );
    this.currentSearch = 0;
    this.displayResult(result.items);
    this.tablesSearchHistoryService.add(this.table, {
      type: SearchTypeEnum.QUERY,
      formValue: this.queryForm.value,
      data: result,
    });
  }

  async scanAll() {
    this.busy.show();
    const result = await firstValueFrom(
      this.tablesSearchService.scan(this.table)
    );
    this.displayResult(result.items);
    this.currentSearch = 0;
    this.tablesSearchHistoryService.add(this.table, {
      type: SearchTypeEnum.SCAN,
      formValue: {
        selectedType: this.types.length > 0 ? this.types[0] : '',
      },
      data: result,
    });
  }

  async scanByType() {
    const result = await firstValueFrom(
      this.tablesSearchService.scan(this.table, {
        filterVariable: 'TYPE',
        filterCondition: FilterConditionEnum.EQ,
        filterValue: [this.scanForm.controls['selectedType'].value],
      })
    );
    this.displayResult(result.items);
    this.currentSearch = 0;
    this.tablesSearchHistoryService.add(this.table, {
      type: SearchTypeEnum.SCAN,
      formValue: this.scanForm.value,
      data: result,
    });
  }

  private displayResult(items: object[]) {
    const columns = collectColumns(items);
    this.colDefs = columns.map((i) => {
      return {
        field: i,
        headerName: i,
      };
    });
    if (this.colDefs.length > 0) {
      this.colDefs[0].pinned = 'left';
    }
    this.colDefs.push({
      headerName: 'Actions',
      pinned: 'right',
      width: 100,
      cellRenderer: TablesViewGridActionsCellComponent,
      delete: this.deleteRow.bind(this),
    } as any);
    this.rowData = items;
    this.cdr.detectChanges();
    this.busy.hide();
  }

  exportToExcel() {
    const types = collectColumns(this.rowData!, 'TYPE');
    const workbook = XLSX.utils.book_new();
    // Add all
    const worksheet = XLSX.utils.json_to_sheet(this.rowData!, {
      header: this.colDefs!.map((i) => i.field!),
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ALL');
    // Add by types
    types.forEach((t) => {
      const data = this.rowData!.filter((i: any) => i['TYPE'] === t);
      const header = collectColumns(data);
      const worksheet = XLSX.utils.json_to_sheet(data, {
        header,
      });
      XLSX.utils.book_append_sheet(workbook, worksheet, t);
    });

    XLSX.writeFile(workbook, 'Data.xlsx', { compression: true });
  }

  onCellKeyPress(event: CellKeyPressEvent | any) {
    const field = event.colDef.field;
    if (!field || event.type !== 'cellKeyPress') {
      return;
    }
    switch (event.event.key) {
      case 'c':
        const value = event.node.data[field];
        navigator.clipboard.writeText(value);
        this.toaster.showSuccess(`Value ${value} copied to clipboard.`);
        break;
      case 'q':
        if (event.colDef.field === 'PK') {
          this.queryForm.patchValue({
            selectedPKValue: event.value,
            selecteSKValue: '',
          });
          this.query();
        }
        break;
      case 's':
        if (event.colDef.field === 'TYPE') {
          this.scanForm.patchValue({
            selectedType: event.value,
          });
          this.scanByType();
        }
    }
  }

  private async deleteRow(params: ICellRendererParams) {
    await firstValueFrom(
      this.tablesSearchService.remove(
        this.table,
        'PK',
        params.data['PK'],
        'SK',
        params.data['SK']
      )
    );
    this.rowData!.splice(params.rowIndex, 1);
    this.tablesSearchHistoryService.updateItems(
      this.table,
      this.currentSearch,
      this.rowData!
    );
    this.rowData = this.rowData!.filter((i) => true);
    this.cdr.detectChanges();
    this.toaster.showSuccess(`Row removed successfully.`);
  }
}

function collectColumns(data: object[], columnHeader?: string) {
  const columns = [
    ...data.reduce((previous: Set<string>, row: object) => {
      const keys = !!columnHeader
        ? [(row as any)[columnHeader]]
        : Object.keys(row);
      return new Set([...previous, ...keys]);
    }, new Set<string>()),
  ];
  columns.sort(sortColumn);
  return columns;
}

const PRE_SORT = [
  'TYPE',
  'PK',
  'SK',
  ...Array.apply(null, Array(5)).map((val, i) => [
    `GSI${i + 1}PK`,
    `GSI${i + 1}SK`,
  ]),
].flat();
const PRE_SORT_SET = new Set<string>(PRE_SORT);
function sortColumn(a: string, b: string) {
  if (PRE_SORT_SET.has(a) || PRE_SORT_SET.has(b)) {
    for (let i = 0; i < PRE_SORT.length; i++) {
      if (a === PRE_SORT[i]) {
        return -1;
      }
      if (b === PRE_SORT[i]) {
        return 1;
      }
    }
  }
  return a < b ? -1 : 1;
}
