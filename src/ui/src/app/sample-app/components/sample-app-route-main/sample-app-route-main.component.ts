import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { SideNavService } from '@core/services';
import { MatDialog } from '@angular/material/dialog';
import {
  SampleAppDialogAddCategoryComponent,
  SampleAppDialogAddCategoryComponentOutput,
} from '../sample-app-dialog-add-category/sample-app-dialog-add-category.component';
import { TablesService } from '@tables/services';
import { firstValueFrom } from 'rxjs';
import { SampleAppService } from '@sample-app/services';
import { ToasterService } from '@lib/services';
import { LifeCyclesUtil } from '@lib/util';
import { TaskCategoryDTO } from '@gen/models';
import {
  SampleAppDialogEditorNoteComponent,
  SampleAppDialogEditorNoteComponentOutput,
} from '../sample-app-dialog-editor-note/sample-app-dialog-editor-note.component';

const TABLE_NAME = 'dyndev-sample-app';

@Component({
  templateUrl: './sample-app-route-main.component.html',
  styleUrls: ['./sample-app-route-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleAppRouteMainComponent implements OnInit {
  isTableInitialized = false;
  categories: TaskCategoryDTO[] = [];

  constructor(
    private sideNavService: SideNavService,
    private tablesService: TablesService,
    private service: SampleAppService,
    private dialog: MatDialog,
    private toaster: ToasterService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.sideNavService.sideNav$.next(undefined);
    const tables = await firstValueFrom(this.tablesService.getTables());
    if (!tables.some((i) => i === TABLE_NAME)) {
      firstValueFrom(this.service.createTable());
      this.toaster.showSuccess(
        'Sample app is initialized. You have new table in your DynamoDB!'
      );
    }
    LifeCyclesUtil.sub(
      [this, this.cdr],
      this.service.getTaskCategories(),
      (cats) => (this.categories = cats)
    );
  }

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
