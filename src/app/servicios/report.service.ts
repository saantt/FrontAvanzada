import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../Paginas/formulario/enviroment';
import { Reporte } from '../interfaces/reporte.interface'; // Asegúrate de crear esta interfaz
import { ApiResponseInforme } from '../interfaces/informe.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'https://proyectofinalprogramacionavanzada-4.onrender.com/api/reportes'; // Ajusta según tu backend

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
        } else if (response && response.respuesta) {
          return response.respuesta;
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

  markReportAsImportant(reportId: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${reportId}/importante`, {}, {
      ...this.getAuthHeaders(),
       ...this.getAuthHeaders(),
        responseType: 'text' as 'json'
    });
  }

  changeStatus(reportId: string, nuevoEstado: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${reportId}/estado`, { nuevoEstado }, {
      ...this.getAuthHeaders(),
       ...this.getAuthHeaders(),
        responseType: 'text' as 'json'
    });
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

  updateReport(reportId: string, updatedReport: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${reportId}`, updatedReport, this.getAuthHeaders()).pipe(
    catchError(this.handleError)
  );
}


  deleteReport(reportId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reportId}`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }
  
  getReportes(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.apiUrl}/reportes`); 
  }

  marcarResuelto(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/reportes/${id}/resuelto`, {}); // Ajusta la ruta de tu API
  }

  generarInforme(filtro: any): Observable<ApiResponseInforme> {
  // Configura parámetros
  let params = new HttpParams();
  
  // Agrega solo los parámetros que tienen valor
  if (filtro.fechaInicio) {
    params = params.set('fechaInicio', filtro.fechaInicio);
  }
  if (filtro.fechaFin) {
    params = params.set('fechaFin', filtro.fechaFin);
  }
  if (filtro.categoriaId) {
    params = params.set('categoriaId', filtro.categoriaId);
  }
  if (filtro.sector) {
    params = params.set('sector', filtro.sector);
  }

  // Agrega headers de autenticación
  const headers = this.getAuthHeaders();

  return this.http.get<ApiResponseInforme>(`${this.apiUrl}/informe`, {
    params,
    headers: headers.headers
  }).pipe(
    catchError(this.handleError)
  );
}

descargarInformePDF(filtro: any): Observable<Blob> {
    // 1. Configurar parámetros
    let params = new HttpParams()
      .set('fechaInicio', this.formatDate(filtro.fechaInicio))
      .set('fechaFin', this.formatDate(filtro.fechaFin));

    if (filtro.categoriaId) {
      params = params.set('categoriaId', filtro.categoriaId);
    }
    if (filtro.sector) {
      params = params.set('sector', filtro.sector);
    }

    // 2. Configurar headers con autenticación
    const headers = this.getAuthHeaders();

    // 3. Hacer la petición
    return this.http.get(`${this.apiUrl}/informe/pdf`, {
      params,
      headers: headers.headers,
      responseType: 'blob' // ¡Importante para descargar archivos!
    }).pipe(
      catchError(this.handleError)
    );
  }

  private formatDate(date: Date | string): string {
    // Convierte Date a string ISO (yyyy-MM-ddTHH:mm:ss)
    if (date instanceof Date) {
      return date.toISOString();
    }
    return date;
  }

}