import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

// Interfaces para tipos de datos
interface User {
  _id?: string;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  role: 'user' | 'moderator' | 'admin';
  isActive?: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  userId: string;
}

interface RecoverResponse {
  message: string;
  resetToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Ajusta según tu backend
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue && !this.jwtHelper.isTokenExpired();
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  public get isModerator(): boolean {
    return this.currentUserValue?.role === 'moderator';
  }

  // Registro de usuario
  register(userData: {
    nombre: string;
    telefono: string;
    ciudad: string;
    direccion: string;
    email: string;
    password: string;
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  // Activación de cuenta
  activateAccount(userId: string, activationCode: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/activate`, { userId, activationCode }).pipe(
      catchError(this.handleError)
    );
  }

  // Login de usuario
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if (response.token && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Logout
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Recuperación de contraseña
  recoverPassword(email: string): Observable<RecoverResponse> {
    return this.http.post<RecoverResponse>(`${this.apiUrl}/recover-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  // Reset de contraseña
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      { token, newPassword }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Verificar token de recuperación
  verifyResetToken(token: string): Observable<{ valid: boolean, email?: string }> {
    return this.http.post<{ valid: boolean, email?: string }>(
      `${this.apiUrl}/verify-reset-token`,
      { token }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener información del usuario actual
  getCurrentUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      catchError(error => {
        if (error.status === 0) {
          // Error de conexión
          console.error('El servidor backend no está disponible');
          return throwError(() => new Error('El servicio no está disponible. Intente más tarde.'));
        }
        // Otros tipos de errores
        return throwError(() => new Error('Error al obtener datos del usuario'));
      })
    );
  }

  // Actualizar información del usuario
  updateUserInfo(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update`, userData).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar cuenta de usuario
  deleteAccount(password: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete`).pipe(
      tap(() => {
        this.logout();
      }),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 0) {
        errorMessage = 'Error de conexión con el servidor';
      } else {
        errorMessage = error.error?.message || error.statusText;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      catchError(error => {
        let errorMsg = 'Error desconocido al cambiar contraseña';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.status === 401) {
          errorMsg = 'La contraseña actual es incorrecta';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  updateUser(userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/profile`, userData); // Or the appropriate endpoint
  }
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/profile`); // Or the appropriate endpoint
  }

  //  No es necesario getToken() ya que usamos currentUserValue
  getCurrentUserId(): string | null {
    const user = this.currentUserValue;
    if (user) {
      return user._id || null; // Accede al ID del usuario desde currentUserValue
    }
    return null;
  }
}