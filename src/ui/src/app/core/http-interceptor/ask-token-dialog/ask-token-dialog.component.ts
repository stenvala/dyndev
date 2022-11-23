import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './ask-token-dialog.component.html',
  styleUrls: ['./ask-token-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AskTokenDialogComponent implements OnInit {
  token = new FormControl('', Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) data: {},
    private dialogRef: MatDialogRef<AskTokenDialogComponent>
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close(this.token.value);
  }
}
