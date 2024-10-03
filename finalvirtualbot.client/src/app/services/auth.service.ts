import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define interfaces for request and response
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;

}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/authenticate'; // Adjust API URL if needed
 
  constructor(private http: HttpClient) {}

  private post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.post<RegisterResponse>('register', request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginResponse>('login', request);
  }
}
