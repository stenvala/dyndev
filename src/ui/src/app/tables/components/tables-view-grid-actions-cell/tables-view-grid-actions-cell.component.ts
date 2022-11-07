import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavigationService } from '@routing/navigation.service';
import { ROUTE_MAP } from '@routing/routes.map';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'tables-view-grid-actions-cell',
  templateUrl: './tables-view-grid-actions-cell.component.html',
  styleUrls: ['./tables-view-grid-actions-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesViewGridActionsCellComponent
  implements ICellRendererAngularComp
{
  private params!: ICellRendererParams;
  constructor(private nav: NavigationService) {}
  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  // gets called whenever the cell refreshes
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    return true;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  edit() {
    this.nav.goto(ROUTE_MAP.TABLES.EDIT, {
      pk: this.params.data['PK'],
      sk: this.params.data['SK'],
    });
  }
  delete() {
    (this.params.colDef! as any).delete(this.params);
  }
}
