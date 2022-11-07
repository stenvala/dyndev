import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FilterConditionEnum,
  TableItemsDTO,
  TableQueryRequestDTO,
} from '@gen/models';
import { NavigationService } from '@routing/navigation.service';
import { TablesSearchService, TablesService } from '@tables/services';
import { firstValueFrom } from 'rxjs';
import {
  CellClickedEvent,
  ColDef,
  ICellRendererParams,
} from 'ag-grid-community';
import * as XLSX from 'xlsx';
import {
  BusyService,
  ControlStateService,
  ToasterService,
} from '@lib/services';
import { FormControl, Validators } from '@angular/forms';
import { TablesViewGridActionsCellComponent } from '../tables-view-grid-actions-cell/tables-view-grid-actions-cell.component';

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
  selectedTypeFc = new FormControl();
  selectedPK = new FormControl('PK');
  selectedPKValue = new FormControl('', Validators.required);
  selectedSK = new FormControl(FilterConditionEnum.BEGINS_WITH);
  selectedSKValue = new FormControl();
  matchOptions = [FilterConditionEnum.BEGINS_WITH, FilterConditionEnum.EQ];

  private table!: string;
  constructor(
    private tablesService: TablesService,
    private tablesSearchService: TablesSearchService,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef,
    private cs: ControlStateService,
    private busy: BusyService,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.state = this.cs.get<ComponentState>(CS_KEY, {
      isScanOpen: false,
      isQueryOpen: false,
    })!;
    this.tablesService.setTablesToSideNav();
    this.table = this.nav.params$.value['table'] as string;
    this.solveTypes();
    this.scanAll();
  }

  private async solveTypes() {
    // get types
    const schema = await firstValueFrom(
      this.tablesService.getSchema(this.table)
    );
    this.types = schema.schema.types.map((i) => i.type);
    if (this.types.length > 0) {
      this.selectedTypeFc.setValue(this.types[0]);
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
      pk: this.selectedPK.value,
      pkValue: this.selectedPKValue.value,
    };
    const pk = this.selectedPK.value;
    let sk = 'SK';
    if (pk !== 'PK') {
      sk = pk.replace('PK', 'SK');
      request.indexName = pk.replace('PK', '');
    }
    const skValue = this.selectedSKValue.value;
    if (skValue) {
      request.sk = sk;
      request.skValue = skValue;
      request.skCondition = this.selectedSK.value;
    }
    this.busy.show();
    const result = await firstValueFrom(
      this.tablesSearchService.query(this.table, request)
    );
    this.displayResult(result.items);
  }

  async scanAll() {
    this.busy.show();
    const result = await firstValueFrom(
      this.tablesSearchService.scan(this.table)
    );
    this.displayResult(result.items);
  }

  async scanByType() {
    const result = await firstValueFrom(
      this.tablesSearchService.scan(this.table, {
        filterVariable: 'TYPE',
        filterCondition: FilterConditionEnum.EQ,
        filterValue: [this.selectedTypeFc.value],
      })
    );
    this.displayResult(result.items);
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

  onCellClicked(event: CellClickedEvent) {
    const field = event.colDef.field;
    if (!field) {
      return;
    }
    const value = event.node.data[field];
    navigator.clipboard.writeText(value);
    this.toaster.showSuccess(`Value ${value} copied to clipboard.`);
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
