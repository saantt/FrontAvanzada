import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../servicios/report.service';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-reportes',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mis-reportes.component.html',
  styleUrl: './mis-reportes.component.css'
})
export class MisReportesComponent implements OnInit {
  reports: any[] = [];
  selectedReport: any = null;

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
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
    // const userId = this.authService.currentUserValue?._id; // Use currentUserValue with optional chaining
      this.reportService.getReports().subscribe({
        next: (data) => {
          console.log(data);
          
          this.reports = data.filter(data => data.clienteId === this.obtenerClienteIdDesdeToken());
          console.log(this.reports);
          
        },
        error: (error) => {
          console.error('Error fetching my reports:', error);
          // Handle error (e.g., show an error message)
        }
      });
  }

  showReportDetails(reportId: string): void {
    // this.reportService.getReportById(reportId).subscribe({
    //   next: (data) => {
    //     this.selectedReport = data;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching report details:', error);
    //     // Handle error
    //   }
    // });
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