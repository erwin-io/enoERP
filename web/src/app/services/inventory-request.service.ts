import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { InventoryRequest } from '../model/inventory-request';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class InventoryRequestService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: InventoryRequest[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequest.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('inventoryRequest')),
      catchError(this.handleError('inventoryRequest', []))
    );
  }

  getByCode(inventoryRequestCode: string): Observable<ApiResponse<InventoryRequest>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequest.getByCode + inventoryRequestCode)
    .pipe(
      tap(_ => this.log('inventoryRequest')),
      catchError(this.handleError('inventoryRequest', []))
    );
  }

  create(data: any): Observable<ApiResponse<InventoryRequest>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequest.create, data)
    .pipe(
      tap(_ => this.log('inventoryRequest')),
      catchError(this.handleError('inventoryRequest', []))
    );
  }

  update(inventoryRequestCode: string, data: any): Observable<ApiResponse<InventoryRequest>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequest.update + inventoryRequestCode, data)
    .pipe(
      tap(_ => this.log('inventoryRequest')),
      catchError(this.handleError('inventoryRequest', []))
    );
  }

  processStatus(inventoryRequestCode: string, data: any): Observable<ApiResponse<InventoryRequest>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequest.processStatus + inventoryRequestCode, data)
    .pipe(
      tap(_ => this.log('inventoryRequest')),
      catchError(this.handleError('inventoryRequest', []))
    );
  }

  closeRequest(inventoryRequestCode: string, data: any): Observable<ApiResponse<InventoryRequest>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryRequest.closeRequest + inventoryRequestCode, data)
    .pipe(
      tap(_ => this.log('inventoryRequest')),
      catchError(this.handleError('inventoryRequest', []))
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
