import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { Warehouse } from '../model/warehouse';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: Warehouse[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.warehouse.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('warehouse')),
      catchError(this.handleError('warehouse', []))
    );
  }

  getById(warehouseId: string): Observable<ApiResponse<Warehouse>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.warehouse.getById + warehouseId)
    .pipe(
      tap(_ => this.log('warehouse')),
      catchError(this.handleError('warehouse', []))
    );
  }

  create(data: any): Observable<ApiResponse<Warehouse>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.warehouse.create, data)
    .pipe(
      tap(_ => this.log('warehouse')),
      catchError(this.handleError('warehouse', []))
    );
  }

  update(id: string, data: any): Observable<ApiResponse<Warehouse>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.warehouse.update + id, data)
    .pipe(
      tap(_ => this.log('warehouse')),
      catchError(this.handleError('warehouse', []))
    );
  }

  delete(id: string): Observable<ApiResponse<Warehouse>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.warehouse.delete + id)
    .pipe(
      tap(_ => this.log('warehouse')),
      catchError(this.handleError('warehouse', []))
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
