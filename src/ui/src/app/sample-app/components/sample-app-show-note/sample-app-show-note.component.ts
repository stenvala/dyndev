import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskDTO } from '@gen/models';
import { LifeCyclesUtil } from '@lib/util';
import { SampleAppService } from '@sample-app/services';

import hljs from 'highlight.js';
import { SampleAppDialogEditorNoteComponent } from '../sample-app-dialog-editor-note/sample-app-dialog-editor-note.component';

@Component({
  selector: 'sample-app-show-note',
  templateUrl: './sample-app-show-note.component.html',
  styleUrls: ['./sample-app-show-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleAppShowNoteComponent implements OnInit {
  @Input() noteId!: string;
  task?: TaskDTO;
  latch = true;
  constructor(
    private service: SampleAppService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    LifeCyclesUtil.sub(
      [this, this.cdr],
      this.service.getTask(this.noteId),
      (task) => {
        this.task = task;
        // Otherwise hljs doesn't work
        this.latch = false;
        this.cdr.detectChanges();
        this.latch = true;
        setTimeout(() => {
          hljs.highlightAll();
        }, 0);
      }
    );
  }

  ngOnDestroy() {
    LifeCyclesUtil.stop(this);
  }

  edit() {
    const width = Math.min(900, window.innerWidth - 100);
    this.dialog.open(SampleAppDialogEditorNoteComponent, {
      data: {
        noteId: this.noteId,
      },
      width: `${width}px`,
    });
  }
}
