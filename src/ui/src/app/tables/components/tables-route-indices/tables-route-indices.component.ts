import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { TableIndexDTO } from '@gen/models';
import { NavigationService } from '@routing/navigation.service';
import { ROUTE_MAP } from '@routing/routes.map';
import { TablesService } from '@tables/services/tables.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tables-route-indices',
  templateUrl: './tables-route-indices.component.html',
  styleUrls: ['./tables-route-indices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesRouteIndicesComponent implements OnInit {
  private table!: string;
  indices?: TableIndexDTO[];
  constructor(
    private tablesService: TablesService,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.table = this.nav.params$.value['table'] as string;
    this.tablesService.setTablesToSideNav();
    this.indices = await firstValueFrom(
      this.tablesService.getIndices(this.table)
    );
    this.cdr.detectChanges();
  }

  async deleteTable() {
    if (confirm('Are you sure you want to delete the table?')) {
      await firstValueFrom(this.tablesService.deleteTable(this.table));
      this.nav.goto(ROUTE_MAP.TABLES);
    }
  }

  // https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
  humanFileSize(bytes: number, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= thresh &&
      u < units.length - 1
    );

    return bytes.toFixed(dp) + ' ' + units[u];
  }
}
