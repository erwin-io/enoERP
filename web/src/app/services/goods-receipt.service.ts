import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { GoodsReceipt } from '../model/goods-receipt';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: GoodsReceipt[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsReceipt.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('goodsReceipt')),
      catchError(this.handleError('goodsReceipt', []))
    );
  }

  getByCode(goodsReceiptCode: string): Observable<ApiResponse<GoodsReceipt>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsReceipt.getByCode + goodsReceiptCode)
    .pipe(
      tap(_ => this.log('goodsReceipt')),
      catchError(this.handleError('goodsReceipt', []))
    );
  }

  create(data: any): Observable<ApiResponse<GoodsReceipt>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsReceipt.create, data)
    .pipe(
      tap(_ => this.log('goodsReceipt')),
      catchError(this.handleError('goodsReceipt', []))
    );
  }

  update(goodsReceiptCode: string, data: any): Observable<ApiResponse<GoodsReceipt>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsReceipt.update + goodsReceiptCode, data)
    .pipe(
      tap(_ => this.log('goodsReceipt')),
      catchError(this.handleError('goodsReceipt', []))
    );
  }

  updateStatus(goodsReceiptCode: string, data: any): Observable<ApiResponse<GoodsReceipt>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsReceipt.updateStatus + goodsReceiptCode, data)
    .pipe(
      tap(_ => this.log('goodsReceipt')),
      catchError(this.handleError('goodsReceipt', []))
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
