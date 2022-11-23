import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from '@lib/services';
import { SampleAppService } from '@sample-app/services';
import { TablesService } from '@tables/services';
import { firstValueFrom } from 'rxjs';
import {
  SampleAppDialogAddCategoryComponent,
  SampleAppDialogAddCategoryComponentOutput,
} from '../sample-app-dialog-add-category/sample-app-dialog-add-category.component';
import { SampleAppDialogEditorNoteComponent } from '../sample-app-dialog-editor-note/sample-app-dialog-editor-note.component';

@Component({
  selector: 'sample-app-toolbar',
  templateUrl: './sample-app-toolbar.component.html',
  styleUrls: ['./sample-app-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleAppToolbarComponent implements OnInit {
  constructor(
    private service: SampleAppService,
    private dialog: MatDialog,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {}

  addCategory() {
    const dialogRef = this.dialog.open(SampleAppDialogAddCategoryComponent, {});
    dialogRef
      .afterClosed()
      .subscribe(async (data: SampleAppDialogAddCategoryComponentOutput) => {
        if (data) {
          const category = await firstValueFrom(
            this.service.createTaskCategory(data.name)
          );
          this.toaster.showSuccess(
            `Category ${category.name} created successfully.`
          );
          await this.service.initSideNav();
        }
      });
  }

  addNote() {
    const width = Math.min(900, window.innerWidth - 100);
    this.dialog.open(SampleAppDialogEditorNoteComponent, {
      width: `${width}px`,
    });
  }
}
