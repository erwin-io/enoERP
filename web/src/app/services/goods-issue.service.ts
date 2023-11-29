import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { GoodsIssue } from '../model/goods-issue';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class GoodsIssueService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: GoodsIssue[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsIssue.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('goodsIssue')),
      catchError(this.handleError('goodsIssue', []))
    );
  }

  getByCode(goodsIssueCode: string): Observable<ApiResponse<GoodsIssue>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsIssue.getByCode + goodsIssueCode)
    .pipe(
      tap(_ => this.log('goodsIssue')),
      catchError(this.handleError('goodsIssue', []))
    );
  }

  create(data: any): Observable<ApiResponse<GoodsIssue>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsIssue.create, data)
    .pipe(
      tap(_ => this.log('goodsIssue')),
      catchError(this.handleError('goodsIssue', []))
    );
  }

  update(goodsIssueCode: string, data: any): Observable<ApiResponse<GoodsIssue>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsIssue.update + goodsIssueCode, data)
    .pipe(
      tap(_ => this.log('goodsIssue')),
      catchError(this.handleError('goodsIssue', []))
    );
  }

  updateStatus(goodsIssueCode: string, data: any): Observable<ApiResponse<GoodsIssue>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.goodsIssue.updateStatus + goodsIssueCode, data)
    .pipe(
      tap(_ => this.log('goodsIssue')),
      catchError(this.handleError('goodsIssue', []))
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
