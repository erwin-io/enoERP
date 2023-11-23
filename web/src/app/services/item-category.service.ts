import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { ItemCategory } from '../model/item-category';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class ItemCategoryService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: ItemCategory[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.itemCategory.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('itemCategory')),
      catchError(this.handleError('itemCategory', []))
    );
  }

  getByCode(itemCategoryCode: string): Observable<ApiResponse<ItemCategory>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.itemCategory.getByCode + itemCategoryCode)
    .pipe(
      tap(_ => this.log('itemCategory')),
      catchError(this.handleError('itemCategory', []))
    );
  }

  create(data: any): Observable<ApiResponse<ItemCategory>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.itemCategory.create, data)
    .pipe(
      tap(_ => this.log('itemCategory')),
      catchError(this.handleError('itemCategory', []))
    );
  }

  update(itemCategoryCode: string, data: any): Observable<ApiResponse<ItemCategory>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.itemCategory.update + itemCategoryCode, data)
    .pipe(
      tap(_ => this.log('itemCategory')),
      catchError(this.handleError('itemCategory', []))
    );
  }

  delete(itemCategoryCode: string): Observable<ApiResponse<ItemCategory>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.itemCategory.delete + itemCategoryCode)
    .pipe(
      tap(_ => this.log('itemCategory')),
      catchError(this.handleError('itemCategory', []))
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
