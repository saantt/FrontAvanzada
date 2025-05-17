import { Component } from '@angular/core';
import { OnInit } from '@angular/core'; 
import { ReportService } from '../../servicios/report.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';

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

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReports().subscribe({
      
      next: (data) => {
        this.reports = data;
        this.filteredReports = [...this.reports]; // Initialize filteredReports with all reports
      },
      error: (error) => {
        console.error('Error fetching reports:', error);
        // Handle error (e.g., show an error message)
      },
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
    // this.reportService.getReportById(reportId).subscribe({
    //     next: (data) => {
    //       this.selectedReport = data;
    //       setTimeout(() => {
    //         this.initMap(this.selectedReport.latitud, this.selectedReport.longitud);
    //       }, 0); // Espera a que Angular renderice el div
    //     },
    //     error: (error) => {
    //       console.error('Error fetching report details:', error);
    //     },
    //   });
  }

  closeReportDetails(): void {
    // this.selectedReport = null;
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

  initMap(lat: number, lng: number): void {
  const map = new mapboxgl.Map({
    container: 'mapbox', // ID del div
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: 14
  });

  new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .addTo(map);
  }
}
