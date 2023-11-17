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

  getById(itemCategoryId: string): Observable<ApiResponse<ItemCategory>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.itemCategory.getById + itemCategoryId)
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

  update(id: string, data: any): Observable<ApiResponse<ItemCategory>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.itemCategory.update + id, data)
    .pipe(
      tap(_ => this.log('itemCategory')),
      catchError(this.handleError('itemCategory', []))
    );
  }

  delete(id: string): Observable<ApiResponse<ItemCategory>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.itemCategory.delete + id)
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
