import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { TableItemsDTO } from '@gen/models';
import { NavigationService } from '@routing/navigation.service';
import { TablesSearchService } from '@tables/services';
import { TablesService } from '@tables/services/tables.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tables-route-browse',
  templateUrl: './tables-route-browse.component.html',
  styleUrls: ['./tables-route-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesRouteBrowseComponent implements OnInit {
  private result?: TableItemsDTO;
  private table!: string;
  constructor(
    private tablesSearchService: TablesSearchService,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.table = this.nav.params$.value['table'] as string;
    const result = await firstValueFrom(
      this.tablesSearchService.scan(this.table)
    );
    console.log(result);
  }
}
