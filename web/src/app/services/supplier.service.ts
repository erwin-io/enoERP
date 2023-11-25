import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { Supplier } from '../model/supplier';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class SupplierService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: Supplier[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supplier.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('supplier')),
      catchError(this.handleError('supplier', []))
    );
  }

  getByCode(supplierCode: string): Observable<ApiResponse<Supplier>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supplier.getByCode + supplierCode)
    .pipe(
      tap(_ => this.log('supplier')),
      catchError(this.handleError('supplier', []))
    );
  }

  create(data: any): Observable<ApiResponse<Supplier>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supplier.create, data)
    .pipe(
      tap(_ => this.log('supplier')),
      catchError(this.handleError('supplier', []))
    );
  }

  update(supplierCode: string, data: any): Observable<ApiResponse<Supplier>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supplier.update + supplierCode, data)
    .pipe(
      tap(_ => this.log('supplier')),
      catchError(this.handleError('supplier', []))
    );
  }

  delete(supplierCode: string): Observable<ApiResponse<Supplier>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supplier.delete + supplierCode)
    .pipe(
      tap(_ => this.log('supplier')),
      catchError(this.handleError('supplier', []))
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
