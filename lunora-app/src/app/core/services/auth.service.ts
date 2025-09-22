import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';
import { jwtDecode } from 'jwt-decode'; // Correct import

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));
  //isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'Admin'));  
  isAdmin$ = this.currentUser$.pipe(map(user => true));  

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize auth state from localStorage
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const user: User = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        password: decodedToken.password
      };
      this.currentUserSubject.next(user);
      
      // Set auto logout timer
      const expirationTime = new Date(decodedToken.exp * 1000).getTime() - new Date().getTime();
      this.autoLogout(expirationTime);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.handleAuthentication(response);
      }),
      catchError(error => {
        console.log(error);

        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  register(email: string, name: string, password: string): Observable<AuthResponse> {
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('password', password);

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, formData).pipe(
      tap(response => {
        this.handleAuthentication(response);
      }),
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(response: AuthResponse): void {
    const decodedToken: any = jwtDecode(response.token);
    const user: User = {
      id: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
      password: decodedToken.password
    };

    localStorage.setItem('auth_token', response.token);
    this.currentUserSubject.next(user);
    
    // Set auto logout timer
    const expirationTime = new Date(decodedToken.exp * 1000).getTime() - new Date().getTime();
    this.autoLogout(expirationTime);
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    switch (error.status) {
      case 400:
        return 'Invalid request data.';
      case 401:
        return 'Invalid email or password.';
      case 403:
        return 'You are not authorized to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Email already in use.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unknown error occurred.';
    }
  }

  // Password reset functionality
  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  // Email verification
  verifyEmail(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-email`, { token }).pipe(
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  // User profile update
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, { 
      currentPassword, 
      newPassword 
    }).pipe(
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }
}
