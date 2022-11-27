import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { keySorter } from '@tables/utils';
declare var require: any;
const stringify = require('json-stable-stringify');

@Component({
  templateUrl: './tables-dialog-view-row.component.html',
  styleUrls: ['./tables-dialog-view-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesDialogViewRowComponent implements OnInit {
  toShow!: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { row: object },
    private dialogRef: MatDialogRef<TablesDialogViewRowComponent>
  ) {}

  ngOnInit(): void {
    this.toShow = stringify(this.data.row, { cmp: keySorter, space: 2 });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
