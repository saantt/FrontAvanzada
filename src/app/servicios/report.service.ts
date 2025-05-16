import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../Paginas/formulario/enviroment';
import { Reporte } from '../interfaces/reporte.interface'; // Asegúrate de crear esta interfaz

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/api/reportes'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): { headers: HttpHeaders } {
  const token = localStorage.getItem('token');
  return {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  };
}

  crearReporte(reporte: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reporte, this.getAuthHeaders());
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de estado: ${error.status}, Mensaje: ${error.error || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`,this.getAuthHeaders()).pipe(
      map((response: any) => {
        //  Manejar diferentes estructuras de respuesta
        if (Array.isArray(response.respuesta)) {
          return response.respuesta;
        } else if (response && response.data) {
          return response.data;
        } else {
          return []; //  Devolver un array vacío por defecto
        }
      }),
      catchError(this.handleError)
    );
  }

  getReportById(reportId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/${reportId}`).pipe(
      catchError(this.handleError)
    );
  }

  markReportAsImportant(reportId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reports/${reportId}/important`, {}).pipe(
      catchError(this.handleError)
    );
  }

  addCommentToReport(reportId: string, commentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reports/${reportId}/comments`, commentData).pipe(
      catchError(this.handleError)
    );
  }

  getReportsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/reports`).pipe(
      map((response: any) => {
        //  Manejar diferentes estructuras de respuesta
        if (Array.isArray(response)) {
          return response;
        } else if (response && response.data) {
          return response.data;
        } else {
          return []; //  Devolver un array vacío por defecto
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteReport(reportId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reports/${reportId}`).pipe(
      catchError(this.handleError)
    );
  }
  getReportes(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.apiUrl}/reportes`); // Ajusta la ruta de tu API
  }

  rechazarReporte(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/reportes/${id}/rechazar`, {}); // Ajusta la ruta de tu API
  }
    verificarReporte(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/reportes/${id}/verificar`, {}); // Ajusta la ruta de tu API
  }

  marcarResuelto(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/reportes/${id}/resuelto`, {}); // Ajusta la ruta de tu API
  }

  // Add other methods as needed (e.g., create, edit, delete)
}