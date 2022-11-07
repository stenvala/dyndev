import { Injectable } from '@angular/core';
import { TablesApiService } from '@gen/apis';
import { TableQueryRequestDTO, TableScanRequestDTO } from '@gen/models';

@Injectable({ providedIn: 'root' })
export class TablesSearchService {
  constructor(private api: TablesApiService) {}

  scan(table: string, options: TableScanRequestDTO = {}) {
    return this.api.scanTable(table, options);
  }

  query(table: string, options: TableQueryRequestDTO) {
    return this.api.queryTable(table, options);
  }

  get(table: string, pk: string, pkValue: string, sk: string, skValue: string) {
    return this.api.getTable(table, {
      pk,
      pkValue,
      sk,
      skValue,
    });
  }

  save(table: string, data: object) {
    return this.api.saveItem(table, { item: data });
  }

  remove(
    table: string,
    pk: string,
    pkValue: string,
    sk: string,
    skValue: string
  ) {
    return this.api.deleteItem(table, {
      pk,
      pkValue,
      sk,
      skValue,
    });
  }
}
