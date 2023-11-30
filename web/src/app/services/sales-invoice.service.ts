import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { SalesInvoice } from '../model/sales-invoice';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class SalesInvoiceService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: SalesInvoice[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.salesInvoice.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('salesInvoice')),
      catchError(this.handleError('salesInvoice', []))
    );
  }

  getByCode(salesInvoiceCode: string): Observable<ApiResponse<SalesInvoice>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.salesInvoice.getByCode + salesInvoiceCode)
    .pipe(
      tap(_ => this.log('salesInvoice')),
      catchError(this.handleError('salesInvoice', []))
    );
  }

  create(data: any): Observable<ApiResponse<SalesInvoice>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.salesInvoice.create, data)
    .pipe(
      tap(_ => this.log('salesInvoice')),
      catchError(this.handleError('salesInvoice', []))
    );
  }

  void(salesInvoiceCode: string): Observable<ApiResponse<SalesInvoice>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.salesInvoice.void + salesInvoiceCode)
    .pipe(
      tap(_ => this.log('salesInvoice')),
      catchError(this.handleError('salesInvoice', []))
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
