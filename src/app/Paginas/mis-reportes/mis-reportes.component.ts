import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../servicios/report.service';
import { AuthService } from '../../servicios/auth.service';
import { ComentarioService } from '../../servicios/comentario.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { environment } from './enviromment';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

declare var mapboxgl: any;
@Component({
  selector: 'app-mis-reportes',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mis-reportes.component.html',
  styleUrls: ['./mis-reportes.component.css']
})
export class MisReportesComponent implements OnInit {
  reports: any[] = [];
  showSelectedReport: boolean = false;
  selectedReport: any = null;
  categorias: Categoria[] = [];

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private commentService: ComentarioService,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.loadMyReports();
  }

  // obtener id del usuario
  obtenerClienteIdDesdeToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
 
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || null; // depende de cómo generaste el JWT
    } catch (e) {
      return null;
    }
  }

loadMyReports(): void {
  this.categoriaService.listarCategorias().subscribe({
    next: (categoriasData) => {
      this.categorias = categoriasData;

      this.reportService.getReports().subscribe({
        next: (data) => {

          this.reports = data
            .filter(report => report.clienteId === this.obtenerClienteIdDesdeToken() && report.estadoActual?.estado !== 'ELIMINADO')
            .map(report => {
              const categoria = this.categorias.find(cat => cat.id === report.categoriaId);
              return {
                ...report,
                nombreCategoria: categoria?.nombre || 'Sin categoría'
              };
            });

            setTimeout(() => {
              this.reports.forEach((report, i) => {
                if (report.ubicacion?.latitud && report.ubicacion?.longitud) {
                  this.initMap(report.ubicacion.latitud, report.ubicacion.longitud, report.id);
                }
              });
            }, 100);
        },
        error: (error) => {
          console.error('Error fetching my reports:', error);
        }
      });
    },
    error: (err) => {
      console.error('Error fetching categories:', err);
    }
  });
}

  showReportDetails(reportId: string): void {
    // if (this.selectedReport && this.selectedReport.reporteId === reportId) {
    //   this.selectedReport = null; // Cierra si ya estaba abierto
    //   return;
    // }
    this.commentService.getComment(reportId).pipe(
      switchMap((comentarios: any[]) => {
        if (comentarios.length === 0) {
          return of([]); // sigue al next con array vacío
        } 
        const comentariosConUsuario$ = comentarios.map(comentario =>
          this.authService.getUserComment(comentario.clienteId).pipe(
            map((usuario: any) => ({
              ...comentario,
              nombreCliente: usuario.nombre // o fullName
            })),
            // Si falla, igual devuelve el comentario
            catchError(() => {
              return of({
                ...comentario,
                nombreCliente: 'Desconocido'
              });
            })
          )
        );
        return forkJoin(comentariosConUsuario$);
      })
    ).subscribe({
      next: (data) => {
        this.selectedReport = { reporteId: reportId, comentarios: data };
        console.log(this.selectedReport);
        
      },
      error: (error) => {
        console.error('Error fetching report details:', error);
        // Handle error
      }
    });
  }

  closeReportDetails(): void {
    this.selectedReport = null;
      setTimeout(() => {
        this.reports.forEach((report, i) => {
          if (report.ubicacion?.latitud && report.ubicacion?.longitud) {
            this.initMap(report.ubicacion.latitud, report.ubicacion.longitud, report.id);
          }
        });
      }, 100);
  }

  editReport(reportId: string): void {
  this.router.navigate(['/editar-reporte', reportId]);
  }

  deleteReport(reportId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      this.reportService.deleteReport(reportId).subscribe({
        next: () => {
          console.log('Report deleted successfully');
          // Remove the report from the list
          this.reports = this.reports.filter(report => report.id !== reportId);
        },
        error: (error) => {
          console.error('Error deleting report:', error);
          // Handle error
        }
      });
    }
  }

  initMap(lat: number, lng: number, reportId: string): void {
    const mapContainer = document.getElementById(`map-${reportId}`);
    if (!mapContainer) {
      console.warn(`No se encontró el div para el mapa con ID map-${reportId}`);
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 14,
      interactive: true
    });

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
  }
}