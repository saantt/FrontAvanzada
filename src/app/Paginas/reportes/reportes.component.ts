import { Component } from '@angular/core';
import { OnInit } from '@angular/core'; 
import { ReportService } from '../../servicios/report.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  selectedCategory: string = '';
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
    if (this.selectedCategory) {
      this.filteredReports = this.reports.filter(report => report.category === this.selectedCategory);
    } else {
      this.filteredReports = [...this.reports]; // Show all reports
    }
  }

  showReportDetails(reportId: string): void {
    this.reportService.getReportById(reportId).subscribe({
      next: (data) => {
        this.selectedReport = data;
      },
      error: (error) => {
        console.error('Error fetching report details:', error);
        // Handle error
      },
    });
  }

  closeReportDetails(): void {
    this.selectedReport = null;
  }

  markAsImportant(reportId: string): void {
    this.reportService.markReportAsImportant(reportId).subscribe({
      next: (response) => {
        console.log('Report marked as important:', response);
        // Update the report in the list (optimistic update)
        const report = this.reports.find(r => r.id === reportId);
        if (report) {
          report.importantCount = (report.importantCount || 0) + 1;
        }
        if (this.selectedReport && this.selectedReport.id === reportId) {
          this.selectedReport.importantCount = (this.selectedReport.importantCount || 0) + 1;
        }
      },
      error: (error) => {
        console.error('Error marking report as important:', error);
        // Handle error (e.g., show an error message)
      },
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
}
