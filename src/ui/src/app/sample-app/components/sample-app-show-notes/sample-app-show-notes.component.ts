import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { StatusEnum, TaskCategoryDTO, TaskDTO } from '@gen/models';
import { BusyService } from '@lib/services';
import { LifeCyclesUtil } from '@lib/util';
import { SampleAppService } from '@sample-app/services';

@Component({
  selector: 'sample-app-show-notes',
  templateUrl: './sample-app-show-notes.component.html',
  styleUrls: ['./sample-app-show-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleAppShowNotesComponent implements OnInit {
  @Input() kind!: 'category' | 'status';
  @Input() category?: TaskCategoryDTO;
  @Input() status?: string;

  title: string = '';
  noteIdList?: string[];

  constructor(
    private service: SampleAppService,
    private busy: BusyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const busyId = this.busy.show();
    if (this.kind == 'category') {
      this.title = this.category!.name;
      LifeCyclesUtil.sub(
        [this, this.cdr],
        this.service.getTasksByCategory(this.category!.id),
        (list) => {
          this.noteIdList = list;
          this.busy.hide(busyId);
        }
      );
    } else {
      LifeCyclesUtil.sub(
        [this, this.cdr],
        this.service.getTasksByStatus(this.status! as any),
        (list) => {
          this.title = this.status!;
          this.noteIdList = list;
          this.busy.hide(busyId);
        }
      );
    }
  }
  ngOnDestroy(): void {
    LifeCyclesUtil.stop(this);
  }
}
