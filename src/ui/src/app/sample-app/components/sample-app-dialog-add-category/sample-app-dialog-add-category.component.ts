import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export type SampleAppDialogAddCategoryComponentOutput =
  | false
  | {
      name: string;
    };

@Component({
  templateUrl: './sample-app-dialog-add-category.component.html',
  styleUrls: ['./sample-app-dialog-add-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleAppDialogAddCategoryComponent implements OnInit {
  categoryNameFC = new FormControl('', Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) data: {},
    private dialogRef: MatDialogRef<SampleAppDialogAddCategoryComponent>
  ) {}

  ngOnInit(): void {}

  closeDialog(shouldAdd: boolean) {
    const result = shouldAdd ? { name: this.categoryNameFC.value } : false;
    this.dialogRef.close(result);
  }
}
