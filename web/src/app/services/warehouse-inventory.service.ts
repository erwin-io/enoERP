import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { ItemWarehouse } from '../model/item-warehouse';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class WarehouseInventoryService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: ItemWarehouse[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.warehouseInventory.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('warehouse-inventory')),
      catchError(this.handleError('warehouse-inventory', []))
    );
  }

  getByItemCode(warehouseCode: string, itemCode: string): Observable<ApiResponse<ItemWarehouse>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.warehouseInventory.getByItemCode + warehouseCode + "/getByItemCode/" + itemCode)
    .pipe(
      tap(_ => this.log('warehouse-inventory')),
      catchError(this.handleError('warehouse-inventory', []))
    );
  }

  handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }
  log(message: string) {
    console.log(message);
  }
}
