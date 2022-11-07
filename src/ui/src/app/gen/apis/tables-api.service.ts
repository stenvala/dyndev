// This file is automatically generated. Don't edit.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { subsToUrl } from './../subs-to-url.func';
import {
  StatusDTO,
  TableItemDTO,
  TableItemRequestDTO,
  TableItemsDTO,
  TableQueryRequestDTO,
  TableScanRequestDTO,
  TableSchemaDTO,
  TablesDTO,
} from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class TablesApiService {
  constructor(private http: HttpClient) {}

  deleteItem(table: string, dto: TableItemRequestDTO): Observable<StatusDTO> {
    const url = subsToUrl('/api/tables/table/:table/delete-item', { table });
    return this.http.post<StatusDTO>(url, dto);
  }

  getTable(table: string, dto: TableItemRequestDTO): Observable<TableItemDTO> {
    const url = subsToUrl('/api/tables/table/:table/get', { table });
    return this.http.post<TableItemDTO>(url, dto);
  }

  getTableSchema(table: string): Observable<TableSchemaDTO> {
    const url = subsToUrl('/api/tables/table/:table/schema', { table });
    return this.http.get<TableSchemaDTO>(url);
  }

  getTables(): Observable<TablesDTO> {
    const url = subsToUrl('/api/tables/list', {});
    return this.http.get<TablesDTO>(url);
  }

  queryTable(
    table: string,
    dto: TableQueryRequestDTO
  ): Observable<TableItemsDTO> {
    const url = subsToUrl('/api/tables/table/:table/query', { table });
    return this.http.post<TableItemsDTO>(url, dto);
  }

  saveItem(table: string, dto: TableItemDTO): Observable<TableItemDTO> {
    const url = subsToUrl('/api/tables/table/:table/save', { table });
    return this.http.post<TableItemDTO>(url, dto);
  }

  scanTable(
    table: string,
    dto: TableScanRequestDTO
  ): Observable<TableItemsDTO> {
    const url = subsToUrl('/api/tables/table/:table/scan', { table });
    return this.http.post<TableItemsDTO>(url, dto);
  }
}
