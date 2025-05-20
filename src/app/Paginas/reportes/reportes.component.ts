import { Component } from '@angular/core';
import { OnInit } from '@angular/core'; 
import { ReportService } from '../../servicios/report.service';
import { AuthService } from '../../servicios/auth.service';
import { ComentarioService } from '../../servicios/comentario.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { environment } from './enviromment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import * as mapboxgl from 'mapbox-gl';
import { of, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

declare var mapboxgl: any;
@Component({
  selector: 'app-reportes',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  reports: any[] = [];
  filteredReports: any[] = [];
  categories: string[] = ['seguridad', 'emergencias médicas', 'infraestructura', 'mascotas', 'comunidad']; // From your doc [cite: 7]
  selectedImportant: string = '';
  selectedReport: any = null;
  newCommentText: string = '';
  categorias: Categoria[] = [];

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private commentService: ComentarioService,
    private categoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.loadReports();
  }

  loadReports(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (categoriasData) => {
        this.categorias = categoriasData;

        this.reportService.getReports().subscribe({
          next: (data) => {
            // Añadir nombreCategoria a cada reporte según idCategoria
            this.reports = data
            .filter(report => report.estadoActual?.estado !== 'ELIMINADO')
            .map(report => {
              const categoria = this.categorias.find(cat => cat.id === report.categoriaId);
              return {
                ...report,
                nombreCategoria: categoria ? categoria.nombre : 'Sin categoría'
              };
            });

            this.filteredReports = [...this.reports];

            setTimeout(() => {
              this.filteredReports.forEach((report, i) => {
                if (report.ubicacion?.latitud && report.ubicacion?.longitud) {
                  this.initMap(report.ubicacion.latitud, report.ubicacion.longitud, report.id);
                }
              });
            }, 100);
          },
          error: (error) => {
            console.error('Error al obtener reportes:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });
  }


  filterReports(): void {
   if (this.selectedImportant) {
      this.filteredReports = this.reports.filter(report => report.contadorImportante == this.selectedImportant);
    } else {
      this.filteredReports = [...this.reports]; // Show all reports
    }
  }

  showReportDetails(reportId: string): void {
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
      this.filteredReports.forEach((report) => {
        if (report.ubicacion?.latitud && report.ubicacion?.longitud) {
          this.initMap(report.ubicacion.latitud, report.ubicacion.longitud, report.id);
        }
      });
    }, 0);
  }

  markAsImportant(event: Event, reportId: string): void {
      this.reportService.markReportAsImportant(reportId).subscribe({
      next: () => {
        this.loadReports(); // O cargarDatos si así se llamara
      }, error: (err) => {
          console.error('Error al marcar como importante:', err);
        }
      });
  }

  addComment(): void {
    if (this.selectedReport && this.newCommentText) {
      const commentData = { text: this.newCommentText };
      this.reportService.addCommentToReport(this.selectedReport.id, commentData).subscribe({
        next: (response) => {
          console.log('Comment added:', response);
          this.selectedReport.comments.push(response); // Optimistic update
          this.newCommentText = ''; // Clear the input
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          // Handle error
        },
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
