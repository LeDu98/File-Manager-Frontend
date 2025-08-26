import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class HttpService {
    private readonly baseUrl = 'https://localhost:44396/api'; 

    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandlerService
    ) {}

    get<T>(endpoint: string, options?: { headers?: HttpHeaders }): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${endpoint}`, options).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    post<T>(endpoint: string, data: any, options?: { headers?: HttpHeaders }): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, options).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    put<T>(endpoint: string, data: any, options?: { headers?: HttpHeaders }): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, options).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    delete<T>(endpoint: string, options?: { headers?: HttpHeaders }): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    patch<T>(endpoint: string, data: any, options?: { headers?: HttpHeaders }): Observable<T> {
        return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, options).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        const appError = this.errorHandler.handleError(error);
        return throwError(() => appError);
    }
}