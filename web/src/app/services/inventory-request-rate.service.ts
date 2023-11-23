import { T } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { InventoryRequestRate } from '../model/inventory-request-rate';

@Injectable({
  providedIn: 'root'
})
export class InventoryRequestRateService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string; type: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: InventoryRequestRate[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequestRate.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('inventoryRequestRate')),
      catchError(this.handleError('inventoryRequestRate', []))
    );
  }

  getByCode(inventoryRequestRateCode: string): Observable<ApiResponse<InventoryRequestRate>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequestRate.getByCode + inventoryRequestRateCode)
    .pipe(
      tap(_ => this.log('inventoryRequestRate')),
      catchError(this.handleError('inventoryRequestRate', []))
    );
  }

  create(data: any): Observable<ApiResponse<InventoryRequestRate>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequestRate.create, data)
    .pipe(
      tap(_ => this.log('inventoryRequestRate')),
      catchError(this.handleError('inventoryRequestRate', []))
    );
  }

  update(inventoryRequestRateCode: string, data: any): Observable<ApiResponse<InventoryRequestRate>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequestRate.update + inventoryRequestRateCode, data)
    .pipe(
      tap(_ => this.log('inventoryRequestRate')),
      catchError(this.handleError('inventoryRequestRate', []))
    );
  }

  delete(inventoryRequestRateCode: string): Observable<ApiResponse<InventoryRequestRate>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequestRate.delete + inventoryRequestRateCode)
    .pipe(
      tap(_ => this.log('inventoryRequestRate')),
      catchError(this.handleError('inventoryRequestRate', []))
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
