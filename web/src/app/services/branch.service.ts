import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { Branch } from '../model/branch';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class BranchService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: Branch[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.branch.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('branch')),
      catchError(this.handleError('branch', []))
    );
  }

  getById(branchId: string): Observable<ApiResponse<Branch>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.branch.getById + branchId)
    .pipe(
      tap(_ => this.log('branch')),
      catchError(this.handleError('branch', []))
    );
  }

  create(data: any): Observable<ApiResponse<Branch>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.branch.create, data)
    .pipe(
      tap(_ => this.log('branch')),
      catchError(this.handleError('branch', []))
    );
  }

  update(id: string, data: any): Observable<ApiResponse<Branch>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.branch.update + id, data)
    .pipe(
      tap(_ => this.log('branch')),
      catchError(this.handleError('branch', []))
    );
  }

  delete(id: string): Observable<ApiResponse<Branch>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.branch.delete + id)
    .pipe(
      tap(_ => this.log('branch')),
      catchError(this.handleError('branch', []))
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
