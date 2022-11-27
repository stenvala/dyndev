import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FilterConditionEnum,
  TableIndexDTO,
  TableQueryRequestDTO,
} from '@gen/models';
import { NavigationService } from '@routing/navigation.service';
import {
  SavedSearch,
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
  GridReadyEvent,
  GridApi,
  ColumnApi,
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
import { MatDialog } from '@angular/material/dialog';
import { TablesDialogViewRowComponent } from '../tables-dialog-view-row/tables-dialog-view-row.component';

interface ComponentState {
  isScanOpen: boolean;
  isQueryOpen: boolean;
}
const CS_KEY = 'TABLE_ROUTES_STATE';

@Component({
  templateUrl: './tables-route-browse.component.html',
  styleUrls: ['./tables-route-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesRouteBrowseComponent implements OnInit {
  rowData?: object[];
  colDefs?: ColDef[];
  state!: ComponentState;
  indices: TableIndexDTO[] = [];
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
  hasLastKey = false;
  currentSearch = 0;
  searchCount = 0;

  private gridApi?: GridApi;
  private columnApi?: ColumnApi;
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
    private fb: FormBuilder,
    private dialog: MatDialog
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
        this.indices = await firstValueFrom(
          this.tablesService.getIndices(this.table)
        );
        const selectedPK =
          this.indices.length > 0
            ? this.indices[0].keySchema[0].attributeName
            : '';
        this.queryForm.patchValue({
          selectedPK,
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
    this.hasLastKey = !!results.data.lastKey;
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
    const index = this.indices.find(
      (i) => i.keySchema[0].attributeName === pk
    )!;
    request.indexName = index.indexName;
    const skValue = this.queryForm.controls['selectedSKValue'].value;
    if (skValue) {
      request.sk = index.keySchema[1].attributeName;
      request.skValue = skValue;
      request.skCondition = this.queryForm.controls['selectedSK'].value;
    }
    this.busy.show();
    const result = await firstValueFrom(
      this.tablesSearchService.query(this.table, request)
    );
    this.currentSearch = 0;
    this.tablesSearchHistoryService.add(this.table, {
      type: SearchTypeEnum.QUERY,
      formValue: this.queryForm.value,
      data: result,
    });
    this.hasLastKey = !!result.lastKey;
    this.displayResult(result.items);
  }

  private async queryMore(search: SavedSearch) {
    const request: TableQueryRequestDTO = {
      pk: this.queryForm.controls['selectedPK'].value,
      pkValue: this.queryForm.controls['selectedPKValue'].value,
    };
    const pk = this.queryForm.controls['selectedPK'].value;
    const index = this.indices.find(
      (i) => i.keySchema[0].attributeName === pk
    )!;
    request.indexName = index.indexName;
    const skValue = this.queryForm.controls['selectedSKValue'].value;
    if (skValue) {
      request.sk = index.keySchema[1].attributeName;
      request.skValue = skValue;
      request.skCondition = this.queryForm.controls['selectedSK'].value;
    }
    request.lastKey = search.data.lastKey;
    this.busy.show();
    const result = await firstValueFrom(
      this.tablesSearchService.query(this.table, request)
    );

    const items = search.data.items.concat(result.items);
    this.tablesSearchHistoryService.set(this.table, this.currentSearch, {
      type: SearchTypeEnum.QUERY,
      formValue: this.queryForm.value,
      data: {
        items,
        lastKey: result.lastKey,
      },
    });
    this.hasLastKey = !!result.lastKey;
    this.displayResult(items);
  }

  async scanAll() {
    this.busy.show();
    const result = await firstValueFrom(
      this.tablesSearchService.scan(this.table)
    );
    this.currentSearch = 0;
    this.tablesSearchHistoryService.add(this.table, {
      type: SearchTypeEnum.SCAN_ALL,
      formValue: {
        selectedType: this.types.length > 0 ? this.types[0] : '',
      },
      data: result,
    });
    this.hasLastKey = !!result.lastKey;
    this.displayResult(result.items);
  }

  private async scanAllMore(search: SavedSearch) {
    this.busy.show();
    const result = await firstValueFrom(
      this.tablesSearchService.scan(this.table, {
        lastKey: search.data.lastKey,
      })
    );
    const items = search.data.items.concat(result.items);
    this.tablesSearchHistoryService.set(this.table, this.currentSearch, {
      type: SearchTypeEnum.SCAN_ALL,
      formValue: {
        selectedType: this.types.length > 0 ? this.types[0] : '',
      },
      data: {
        items,
        lastKey: result.lastKey,
      },
    });
    this.hasLastKey = !!result.lastKey;
    this.displayResult(items);
  }

  async scanByType() {
    const result = await firstValueFrom(
      this.tablesSearchService.scan(this.table, {
        filterVariable: 'TYPE',
        filterCondition: FilterConditionEnum.EQ,
        filterValue: [this.scanForm.controls['selectedType'].value],
      })
    );
    this.currentSearch = 0;
    this.tablesSearchHistoryService.add(this.table, {
      type: SearchTypeEnum.SCAN,
      formValue: this.scanForm.value,
      data: result,
    });
    this.hasLastKey = !!result.lastKey;
    this.displayResult(result.items);
  }

  async scanByTypeMore(search: SavedSearch) {
    const result = await firstValueFrom(
      this.tablesSearchService.scan(this.table, {
        filterVariable: 'TYPE',
        filterCondition: FilterConditionEnum.EQ,
        filterValue: [this.scanForm.controls['selectedType'].value],
        lastKey: search.data.lastKey,
      })
    );
    const items = search.data.items.concat(result.items);
    this.tablesSearchHistoryService.set(this.table, this.currentSearch, {
      type: SearchTypeEnum.SCAN,
      formValue: this.scanForm.value,
      data: {
        items,
        lastKey: result.lastKey,
      },
    });
    this.hasLastKey = !!result.lastKey;
    this.displayResult(items);
  }

  loadMore() {
    const search = this.tablesSearchHistoryService.get(
      this.table,
      this.currentSearch
    );
    switch (search.type) {
      case SearchTypeEnum.QUERY:
        this.queryMore(search);
        break;
      case SearchTypeEnum.SCAN_ALL:
        this.scanAllMore(search);
        break;
      case SearchTypeEnum.SCAN:
        this.scanByTypeMore(search);
        break;
    }
  }

  private getPreSortList() {
    return [
      'TYPE',
      ...this.indices.map((i) => i.keySchema.map((j) => j.attributeName)),
    ].flat();
  }

  private displayResult(items: object[]) {
    const columns = collectColumns(this.getPreSortList(), items);
    this.colDefs = columns.map((i) => {
      return {
        field: i,
        headerName: i,
      };
    });
    const hasType = !!this.colDefs.find((i) => i.field! === 'TYPE');
    if (this.colDefs.length > 0 && hasType) {
      this.colDefs[0].pinned = 'left';
    }
    this.colDefs.push({
      headerName: 'Actions',
      pinned: 'right',
      width: 100,
      cellRenderer: TablesViewGridActionsCellComponent,
      indices: this.indices,
      delete: this.deleteRow.bind(this),
    } as any);
    this.rowData = items;
    this.cdr.detectChanges();
    this.busy.hide();
    setTimeout(() => {
      this.focusFirstCell();
    });
  }

  exportToExcel() {
    const preSort = this.getPreSortList();
    const types = collectColumns(preSort, this.rowData!, 'TYPE');
    const workbook = XLSX.utils.book_new();
    // Add all
    const worksheet = XLSX.utils.json_to_sheet(this.rowData!, {
      header: this.colDefs!.map((i) => i.field!),
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ALL');
    // Add by types
    types.forEach((t) => {
      const data = this.rowData!.filter((i: any) => i['TYPE'] === t);
      const header = collectColumns(preSort, data);
      const worksheet = XLSX.utils.json_to_sheet(data, {
        header,
      });
      XLSX.utils.book_append_sheet(workbook, worksheet, t);
    });

    XLSX.writeFile(workbook, 'Data.xlsx', { compression: true });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
    this.columnApi = event.columnApi;
    this.focusFirstCell();
  }

  private focusFirstCell() {
    this.gridApi!.setFocusedCell(
      0,
      (this.columnApi as any).columnModel.columnDefs[0].field
    );
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
        const pks = this.indices.map((i) => i.keySchema[0].attributeName);
        const sks = this.indices.map((i) => i.keySchema[1].attributeName);
        if (pks.indexOf(event.colDef.field) > -1 && event.value) {
          this.queryForm.patchValue({
            selectedPK: event.colDef.field,
            selectedPKValue: event.value,
            selectedSKValue: '',
          });
          this.query();
        } else if (sks.indexOf(event.colDef.field) > -1 && event.value) {
          const index = sks.indexOf(event.colDef.field);
          const pkField = this.indices[index].keySchema[0].attributeName;
          this.queryForm.patchValue({
            selectedPK: pkField,
            selectedPKValue: event.data[pkField],
            selectedSK: FilterConditionEnum.EQ,
            selectedSKValue: event.value,
          });
          this.query();
        } else {
          this.toaster.showError(
            'Not on partition key column or value is empty'
          );
        }
        break;
      case 's':
        if (event.colDef.field === 'TYPE') {
          this.scanForm.patchValue({
            selectedType: event.value,
          });
          this.scanByType();
        } else {
          this.toaster.showError('Not on TYPE column');
        }
        break;
      case 'n':
        if (this.currentSearch > 0) {
          this.populateSearchResultsFromIndex(this.currentSearch - 1);
        }
        break;
      case 'p':
        if (this.currentSearch + 1 < this.searchCount) {
          this.populateSearchResultsFromIndex(this.currentSearch + 1);
        }
        break;
      case 'v':
        const focusedCell = this.gridApi!.getFocusedCell();
        const dialogRef = this.dialog.open(TablesDialogViewRowComponent, {
          data: {
            row: event.data,
          },
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(() => {
          this.gridApi!.setFocusedCell(
            focusedCell!.rowIndex,
            focusedCell!.column
          );
        });
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

function collectColumns(
  preSort: string[],
  data: object[],
  columnHeader?: string
) {
  const columns = [
    ...data.reduce((previous: Set<string>, row: object) => {
      const keys = !!columnHeader
        ? [(row as any)[columnHeader]]
        : Object.keys(row);
      return new Set([...previous, ...keys]);
    }, new Set<string>()),
  ];
  columns.sort(getSort(preSort));
  return columns;
}

function getSort(preSort: string[]) {
  const preSortSet = new Set(preSort);
  return function sortColumn(a: string, b: string) {
    if (preSortSet.has(a) || preSortSet.has(b)) {
      for (let i = 0; i < preSort.length; i++) {
        if (a === preSort[i]) {
          return -1;
        }
        if (b === preSort[i]) {
          return 1;
        }
      }
    }
    return a < b ? -1 : 1;
  };
}
