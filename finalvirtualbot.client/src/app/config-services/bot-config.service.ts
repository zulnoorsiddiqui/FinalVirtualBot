import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

// Define BotConfig interface to ensure type safety
interface BotConfig {
  id?: string;
  botName: string;
  provider: string;
  configVersion: string;
  jsonServiceAccount: string;
  region: string;
  language: string;
}

@Injectable({
  providedIn: 'root',
})
export class BotConfigService {
  private apiUrl = 'http://localhost:8080/api/BotConfig';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inject platform to check browser/server
  ) { }

  // Get all bot configurations (only in browser)
  getAllBotConfigs(): Observable<BotConfig[]> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<BotConfig[]>(this.apiUrl).pipe(
        map((response: BotConfig[]) => response || []),
        catchError(this.handleError)
      );
    } else {
      return throwError('API calls not supported during SSR');
    }
  }

  // Get a specific bot configuration by ID (only in browser)
  getBotConfigById(id: string): Observable<BotConfig> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<BotConfig>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    } else {
      return throwError('API calls not supported during SSR');
    }
  }

  // Create a new bot configuration (only in browser)
  createBotConfig(config: BotConfig): Observable<BotConfig> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post<BotConfig>(this.apiUrl, config).pipe(
        catchError(this.handleError)
      );
    } else {
      return throwError('API calls not supported during SSR');
    }
  }

  // Update an existing bot configuration by ID (only in browser)
  updateBotConfig(id: string, config: BotConfig): Observable<BotConfig> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.put<BotConfig>(`${this.apiUrl}/${id}`, config).pipe(
        catchError(this.handleError)
      );
    } else {
      return throwError('API calls not supported during SSR');
    }
  }

  // Delete a bot configuration by ID (only in browser)
  deleteBotConfig(id: string): Observable<void> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    } else {
      return throwError('API calls not supported during SSR');
    }
  }

  // Handle errors globally for this service
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server error (status ${error.status}): ${error.message}`;
    }

    console.error('BotConfigService Error:', errorMessage);
    return throwError(errorMessage || 'An unknown error occurred.');
  }
}
