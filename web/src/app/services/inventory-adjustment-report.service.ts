import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { InventoryAdjustmentReport } from '../model/inventory-adjustment-report';

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentReportService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: InventoryAdjustmentReport[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryAdjustmentReport.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('inventoryAdjustmentReport')),
      catchError(this.handleError('inventoryAdjustmentReport', []))
    );
  }

  getByCode(inventoryAdjustmentReportCode: string): Observable<ApiResponse<InventoryAdjustmentReport>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryAdjustmentReport.getByCode + inventoryAdjustmentReportCode)
    .pipe(
      tap(_ => this.log('inventoryAdjustmentReport')),
      catchError(this.handleError('inventoryAdjustmentReport', []))
    );
  }

  create(data: any): Observable<ApiResponse<InventoryAdjustmentReport>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryAdjustmentReport.create, data)
    .pipe(
      tap(_ => this.log('inventoryAdjustmentReport')),
      catchError(this.handleError('inventoryAdjustmentReport', []))
    );
  }

  update(inventoryAdjustmentReportCode: string, data: any): Observable<ApiResponse<InventoryAdjustmentReport>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryAdjustmentReport.update + inventoryAdjustmentReportCode, data)
    .pipe(
      tap(_ => this.log('inventoryAdjustmentReport')),
      catchError(this.handleError('inventoryAdjustmentReport', []))
    );
  }

  processStatus(inventoryAdjustmentReportCode: string, data: any): Observable<ApiResponse<InventoryAdjustmentReport>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryAdjustmentReport.processStatus + inventoryAdjustmentReportCode, data)
    .pipe(
      tap(_ => this.log('inventoryAdjustmentReport')),
      catchError(this.handleError('inventoryAdjustmentReport', []))
    );
  }

  closeReport(inventoryAdjustmentReportCode: string, data: any): Observable<ApiResponse<InventoryAdjustmentReport>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.inventoryAdjustmentReport.closeReport + inventoryAdjustmentReportCode, data)
    .pipe(
      tap(_ => this.log('inventoryAdjustmentReport')),
      catchError(this.handleError('inventoryAdjustmentReport', []))
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
