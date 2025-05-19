import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../servicios/report.service';
import { AuthService } from '../../servicios/auth.service';
import { ComentarioService } from '../../servicios/comentario.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-mis-reportes',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mis-reportes.component.html',
  styleUrl: './mis-reportes.component.css'
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
            .filter(report => report.clienteId === this.obtenerClienteIdDesdeToken())
            .map(report => {
              const categoria = this.categorias.find(cat => cat.id === report.categoriaId);
              return {
                ...report,
                nombreCategoria: categoria?.nombre || 'Sin categoría'
              };
            });
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
  }

  editReport(reportId: string): void {
    // Navigate to the edit report page
    this.router.navigate(['/edit-report', reportId]);
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
}