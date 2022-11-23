import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { TaskCategoryDTO } from '@gen/models';
import { BusyService } from '@lib/services';
import { LifeCyclesUtil } from '@lib/util';
import { NavigationService } from '@routing/navigation.service';
import { SampleAppService } from '@sample-app/services';
import { firstValueFrom } from 'rxjs';

@Component({
  templateUrl: './sample-app-route-show-notes.component.html',
  styleUrls: ['./sample-app-route-show-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleAppRouteShowNotesComponent implements OnInit {
  kind!: 'category' | 'status';
  category?: TaskCategoryDTO;
  status?: string;

  title: string = '';
  noteIdList?: string[];

  latch = true;

  constructor(
    private service: SampleAppService,
    private cdr: ChangeDetectorRef,
    private nav: NavigationService
  ) {}

  ngOnInit() {
    LifeCyclesUtil.sub([this, this.cdr], this.nav.params$, async (params) => {
      if ('categoryId' in params) {
        this.kind = 'category';
        this.status = undefined;
        this.category = (
          await firstValueFrom(this.service.getTaskCategories())
        ).find((i) => i.id === params['categoryId']);
        this.latch = false;
        this.cdr.detectChanges();
        this.latch = true;
        this.cdr.detectChanges();
        console.log(this.category);
      } else if ('status' in params) {
        this.kind = 'status';
        this.category = undefined;
        this.status = params['status'];
        this.latch = false;
        this.cdr.detectChanges();
        this.latch = true;
      }
      this.service.initSideNav();
    });
  }

  ngOnDestroy(): void {
    LifeCyclesUtil.stop(this);
  }
}
