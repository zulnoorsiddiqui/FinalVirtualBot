import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
  private apiUrl = 'https://localhost:7077/api/BotConfig';

  constructor(private http: HttpClient) {}

  // Get all bot configurations
  getAllBotConfigs(): Observable<BotConfig[]> {
    return this.http.get<BotConfig[]>(this.apiUrl).pipe(
      map((response: BotConfig[]) => response || []),
      catchError(this.handleError)
    );
  }

  // Get a specific bot configuration by ID
  getBotConfigById(id: string): Observable<BotConfig> {
    return this.http.get<BotConfig>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new bot configuration
  createBotConfig(config: BotConfig): Observable<BotConfig> {
    return this.http.post<BotConfig>(this.apiUrl, config).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing bot configuration by ID
  updateBotConfig(id: string, config: BotConfig): Observable<BotConfig> {
    return this.http.put<BotConfig>(`${this.apiUrl}/${id}`, config).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a bot configuration by ID
  deleteBotConfig(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors globally for this service
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('BotConfigService Error:', error);
    // Customize the error message based on status or response
    const errorMessage = error.error.message || 'An unknown error occurred.';
    return throwError(errorMessage);
  }
}
