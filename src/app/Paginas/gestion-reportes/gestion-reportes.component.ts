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

interface Report {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'verified' | 'rejected' | 'resolved';
  date: Date;
  user: string;
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
  displayedColumns: string[] = ['id', 'title', 'category', 'status', 'date', 'user', 'actions'];
  dataSource = new MatTableDataSource<Report>();
  selectedReport: Report | null = null;
  rejectionReason: string = '';

  // Datos de ejemplo (en producción vendrían de un servicio)
  sampleReports: Report[] = [
    {
      id: '1',
      title: 'Bache en calle principal',
      category: 'Infraestructura',
      status: 'pending',
      date: new Date('2023-05-15'),
      user: 'usuario1@example.com',
      location: 'Calle 123'
    },
    {
      id: '2',
      title: 'Robo de bicicleta',
      category: 'Seguridad',
      status: 'verified',
      date: new Date('2023-05-14'),
      user: 'usuario2@example.com',
      location: 'Parque central'
    },
    {
      id: '3',
      title: 'Alumbrado público dañado',
      category: 'Infraestructura',
      status: 'rejected',
      date: new Date('2023-05-13'),
      user: 'usuario3@example.com',
      location: 'Avenida siempre viva'
    }
  ];

  categories = [
    'Todos',
    'Mascota Perdida',
    'Robo',
    'Alumbrado público',
    'Huecos en la vía',
    'Emergencia médica',
    'Contaminación'
  ];

  statuses = [
    'Todos',
    'Pendiente',
    'Verificado',
    'Rechazado',
    'Resuelto'
  ];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      category: ['Todos'],
      status: ['Todos'],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  ngOnInit(): void {
    this.dataSource.data = this.sampleReports;
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    let filteredData = [...this.sampleReports];

    if (filters.category !== 'Todos') {
      filteredData = filteredData.filter(report => report.category === filters.category);
    }

    if (filters.status !== 'Todos') {
      filteredData = filteredData.filter(report => report.status === filters.status.toLowerCase());
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredData = filteredData.filter(report => new Date(report.date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredData = filteredData.filter(report => new Date(report.date) <= toDate);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(report => 
        report.title.toLowerCase().includes(searchTerm) ||
        report.user.toLowerCase().includes(searchTerm)
      );
    }

    this.dataSource.data = filteredData;
  }

  openDetails(report: Report): void {
    this.dialog.open(DetalleReporteComponent, {
      width: '600px',
      data: { report }
    });
  }

  changeStatus(report: Report, newStatus: string): void {
    if (newStatus === 'rejected' && !this.rejectionReason) {
      alert('Debe proporcionar un motivo de rechazo');
      return;
    }

    // En producción, aquí llamarías a un servicio
    report.status = newStatus as any;
    this.applyFilters();
    
    console.log(`Estado cambiado a ${newStatus} para reporte ${report.id}`);
    if (newStatus === 'rejected') {
      console.log(`Motivo de rechazo: ${this.rejectionReason}`);
    }
  }
}