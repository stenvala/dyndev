import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskCategoryDTO, TaskDTO, TaskStatusEnum } from '@gen/models';
import { BusyService, ToasterService } from '@lib/services';
import { NavigationService } from '@routing/navigation.service';
import { SampleAppService } from '@sample-app/services';
import { firstValueFrom } from 'rxjs';

export type SampleAppDialogEditorNoteComponentOutput =
  | false
  | {
      name: string;
    };

@Component({
  templateUrl: './sample-app-dialog-editor-note.component.html',
  styleUrls: ['./sample-app-dialog-editor-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleAppDialogEditorNoteComponent implements OnInit {
  noteForm!: FormGroup;
  categories?: TaskCategoryDTO[];
  statuses = Object.values(TaskStatusEnum);
  isAdding = true;
  private note?: TaskDTO;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { noteId?: string } | null,
    private dialogRef: MatDialogRef<SampleAppDialogEditorNoteComponent>,
    private fb: FormBuilder,
    private service: SampleAppService,
    private toaster: ToasterService,
    private cdr: ChangeDetectorRef,
    private busyService: BusyService,
    private nav: NavigationService
  ) {
    const categoryId = this.nav.params$.value['categoryId'] ?? '';
    const status = this.nav.params$.value['status'] ?? 'WAITING_FOR_INPUT';
    this.noteForm = this.fb.group({
      categoryId: [categoryId],
      status: [status],
      name: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.categories = await firstValueFrom(this.service.getTaskCategories());
    if (this.categories.length === 0) {
      this.toaster.showError(
        "You don't have any categories. Add your first category."
      );
      this.closeDialog(false);
      return;
    }
    if (this.data?.noteId) {
      this.isAdding = false;
      this.note = await firstValueFrom(this.service.getTask(this.data.noteId));
      this.noteForm.patchValue({
        categoryId: this.note.categoryId,
        status: this.note.status,
        name: this.note.name,
        notes: this.note.notes,
      });
    } else if (this.noteForm.controls['categoryId'].value === '') {
      this.noteForm.patchValue({ categoryId: this.categories[0].id });
    }
    this.cdr.detectChanges();
  }

  keyPressedInTextarea($event: KeyboardEvent) {
    if ($event?.key === 'Tab') {
      $event?.preventDefault();
      const element = ($event as any).path[0] as HTMLTextAreaElement;
      const location = element.selectionStart;
      const value = this.noteForm.controls['notes'].value;
      const newValue =
        value.substring(0, location) +
        new Array(3).join(' ') +
        value.substring(location);
      this.noteForm.patchValue({
        notes: newValue,
      });
      // put caret at right position again
      element.selectionStart = location + 2;
      element.selectionEnd = location + 2;
    }
  }

  async closeDialog(save: boolean) {
    this.dialogRef.close();
    if (save) {
      const value = this.noteForm.value;
      const busyId = this.busyService.show();
      if (this.note) {
        await firstValueFrom(
          this.service.saveTask(Object.assign({}, this.note, value))
        );
      } else {
        await firstValueFrom(
          this.service.createTask(value['categoryId'], {
            status: value['status'],
            name: value['name'],
            notes: value['notes'],
          })
        );
      }
      this.busyService.hide(busyId);
      this.toaster.showSuccess('Note saved successfully');
    }
  }
}
