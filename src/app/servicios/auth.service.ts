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
  respuesta: {
    token: string;
  };
}

interface RegisterResponse {
  respuesta: string;
}

interface RecoverResponse {
  message: string;
  resetToken: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:8080/api'; // Ajusta según tu backend
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private jwtHelper = new JwtHelperService();
  public authStatus: BehaviorSubject<boolean>;

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.authStatus = new BehaviorSubject(this.isLoggedIn);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  public get isModerator(): boolean {
    return this.currentUserValue?.role === 'moderator';
  }

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
 
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || null; // depende de cómo generaste el JWT
    } catch (e) {
      return null;
    }
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
    return this.http.post<RegisterResponse>(`${this.apiUrl}/usuarios`, userData).pipe(
      map(response => {
        const message = response.respuesta;
        if (message.includes("Registro exitoso")) {
          this.router.navigate(['/activacion-cuenta']);
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Activación de cuenta
    activateAccount(email: string, codigoValidacion: string): Observable<{ message: string }> {
      return this.http.put<{ message: string }>(`${this.apiUrl}/usuarios/${email}/activar`, { codigoValidacion, email }).pipe(
        map(response => {
            return response;
        }),
        catchError(this.handleError)
      );
    }

  // Login de usuario
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/iniciar-sesion`, { email, password }).pipe(
      map(response => {
        if (response.respuesta.token) {
          localStorage.setItem('token', response.respuesta.token);
          this.authStatus.next(true);
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  // envío de código al correo
  recoverPassword(email: string): Observable<RecoverResponse> {
    return this.http.post<RecoverResponse>(`${this.apiUrl}/usuarios/codigoVerificacion`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  // modificación de contraseña
  validateCodeAndResetPassword(email: string, codigoValidacion: string, nuevaPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/usuarios/${email}/password`, { codigoValidacion, email, nuevaPassword }).pipe(
      map(response => {
          return response;
      }),
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

  getUserComment(idReporte: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/${idReporte}`).pipe(
      map((response: any) => {
        if (response.respuesta) {
          return response.respuesta;
        } else {
          return []; //  Devolver un array vacío por defecto
        }
      }),
      catchError(this.handleError)
    );
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