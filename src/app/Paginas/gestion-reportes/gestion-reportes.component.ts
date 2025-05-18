import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DetalleReporteComponent } from '../detalle-reporte/detalle-reporte.component';
import { ReportService } from '../../servicios/report.service';

interface Report {
  titulo: string;
  nombreCategoria: string;
  fecha: Date;
  description: string;
  status: 'pending' | 'verified' | 'rejected' | 'resolved';
  location: string;
}

@Component({
  selector: 'app-gestion-reportes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './gestion-reportes.component.html',
  styleUrl: './gestion-reportes.component.css'
})
export class GestionReportesComponent implements OnInit{
  filterForm: FormGroup;
  displayedColumns: string[] = [ 'title', 'category', 'date', 'description', 'status'];
  dataSource = new MatTableDataSource<Report>();
  originalData = new MatTableDataSource<Report>();
  selectedReport: Report | null = null;
  rejectionReason: string = '';

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private reportService: ReportService
  ) {
    this.filterForm = this.fb.group({
      dateFrom: [''],
      dateTo: ['']
    });
  }

  ngOnInit(): void {
    this.reportService.getReports().subscribe({
      next: (data) => {
        this.dataSource.data  = data;
        this.originalData.data  = data;
        // this.filterForm.valueChanges.subscribe(() => this.applyFilters());
      },
      error: (error) => {
        console.error('Error fetching reports:', error);
        // Handle error (e.g., show an error message)
      },
    });
  }

  applyFilters(): void {
    const { dateFrom, dateTo } = this.filterForm.value;
    const fechaInicio = new Date(dateFrom + 'T00:00:00');
    const fechaFin = new Date(dateTo + 'T23:59:59.999');
    if (dateFrom && dateTo) {
      this.dataSource.data = this.dataSource.data.filter(item => {
        const fechaItem = new Date(item.fecha);
        console.log(fechaItem >= fechaInicio && fechaItem <= fechaFin);
        
        return (fechaItem >= fechaInicio && fechaItem <= fechaFin);
      });
    }
  } 

  clearFilters() {
    this.filterForm.reset();
    this.dataSource.data = [...this.originalData.data];  // Restablece todos los datos
  }

  changeStatus(reportId: string, newStatus: string): void {
    this.reportService.changeStatus(reportId, newStatus).subscribe({
    next: () => {
      console.log("recargar ");
    }, error: (err) => {
        console.error('Error al marcar como importante:', err);
      }
    });
  }
}