import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReportService } from '../../servicios/report.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-ver-reportes-admin',
  imports: [
    CommonModule,

    FormsModule,
    ReactiveFormsModule,
    
    // Angular Material
   
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule
   
  ],
  // ... otros metadatos
  providers: [ReportService],
  templateUrl: './ver-reportes-admin.component.html',
  styleUrl: './ver-reportes-admin.component.css'
})
export class VerReportesAdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'category', 'status', 'createdAt', 'priority', 'actions'];
  dataSource = new MatTableDataSource<any>();
  categories = [
    { value: 'security', viewValue: 'Seguridad' },
    { value: 'medical', viewValue: 'Emergencias Médicas' },
    { value: 'infrastructure', viewValue: 'Infraestructura' },
    { value: 'pets', viewValue: 'Mascotas' },
    { value: 'community', viewValue: 'Comunidad' }
  ];
  
  statuses = [
    { value: 'pending', viewValue: 'Pendiente' },
    { value: 'verified', viewValue: 'Verificado' },
    { value: 'rejected', viewValue: 'Rechazado' },
    { value: 'resolved', viewValue: 'Resuelto' }
  ];
  
  selectedCategory = 'all';
  selectedStatus = 'all';
  selectedReport: any = null;
  rejectionReason = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('detailDialog') detailDialog!: TemplateRef<any>;
  @ViewChild('rejectDialog') rejectDialog!: TemplateRef<any>;

  constructor(
    private reportService: ReportService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadReports(): void {
    this.reportService.getAllReports().subscribe({
      next: (reports) => {
        this.dataSource.data = reports;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar los reportes', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterReports(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const categoryMatch = this.selectedCategory === 'all' || 
                          data.category === this.selectedCategory;
      const statusMatch = this.selectedStatus === 'all' || 
                         data.status === this.selectedStatus;
      return categoryMatch && statusMatch;
    };
    this.dataSource.filter = 'trigger filter';
  }

  getCategoryName(category: string): string {
    const found = this.categories.find(c => c.value === category);
    return found ? found.viewValue : category;
  }

  getStatusName(status: string): string {
    const found = this.statuses.find(s => s.value === status);
    return found ? found.viewValue : status;
  }

  getCategoryClass(category: string): string {
    return category;
  }

  openReportDetail(report: any): void {
    this.selectedReport = report;
    this.dialog.open(this.detailDialog, {
      width: '80%',
      maxWidth: '800px'
    });
  }

  verifyReport(reportId: string): void {
    this.reportService.verifyReport(reportId).subscribe({
      next: () => {
        this.snackBar.open('Reporte verificado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.loadReports();
        this.dialog.closeAll();
      },
      error: (err) => {
        this.snackBar.open('Error al verificar el reporte', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  rejectReport(report: any): void {
    this.selectedReport = report;
    this.rejectionReason = '';
    this.dialog.open(this.rejectDialog, {
      width: '500px'
    });
  }

  confirmRejection(): void {
    if (!this.rejectionReason) return;
    
    this.reportService.rejectReport(this.selectedReport._id, this.rejectionReason).subscribe({
      next: () => {
        this.snackBar.open('Reporte rechazado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.loadReports();
        this.dialog.closeAll();
      },
      error: (err) => {
        this.snackBar.open('Error al rechazar el reporte', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  markAsResolved(reportId: string): void {
    this.reportService.markAsResolved(reportId).subscribe({
      next: () => {
        this.snackBar.open('Reporte marcado como resuelto', 'Cerrar', {
          duration: 3000
        });
        this.loadReports();
      },
      error: (err) => {
        this.snackBar.open('Error al marcar el reporte', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openEditDialog(report: any): void {
    // Implementar lógica de edición
    this.snackBar.open('Función de edición en desarrollo', 'Cerrar', {
      duration: 3000
    });
  }
}
