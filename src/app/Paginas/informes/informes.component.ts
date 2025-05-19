import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportService } from '../../servicios/report.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { ApiResponseInforme, InformeGeneradoDTO } from '../../interfaces/informe.interface';
import { Categoria } from '../../interfaces/categoria.interface';

@Component({
  selector: 'app-informes',
  standalone: true, // ← Esto hace que el componente funcione sin módulo
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css'],
  imports: [FormsModule, CommonModule], // ← Módulos necesarios
  providers: [DatePipe] // ← Proveedores de servicios
})
export class InformesComponent implements OnInit {
  informe: InformeGeneradoDTO | null = null;
  categorias: Categoria[] = [];
  loading = false;
  filtro = {
    fechaInicio: new Date(new Date().setDate(new Date().getDate() - 7)),
    fechaFin: new Date(),
    categoriaId: '',
    sector: ''
  };

  constructor(
    private reportService: ReportService,
    private categoriaService: CategoriaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (res) => this.categorias = res,
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  generarInforme(): void {
    this.loading = true;
    
    const params = {
      fechaInicio: this.datePipe.transform(this.filtro.fechaInicio, 'yyyy-MM-ddTHH:mm:ss')!,
      fechaFin: this.datePipe.transform(this.filtro.fechaFin, 'yyyy-MM-ddTHH:mm:ss')!,
      categoriaId: this.filtro.categoriaId,
      sector: this.filtro.sector
    };

    this.reportService.generarInforme(params).subscribe({
      next: (res: ApiResponseInforme) => {
        this.informe = res.respuesta;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al generar informe:', err);
        this.loading = false;
      }
    });
  }

  descargarPDF(): void {
    const params = { 
      fechaInicio: this.datePipe.transform(this.filtro.fechaInicio, 'yyyy-MM-ddTHH:mm:ss')!,
      fechaFin: this.datePipe.transform(this.filtro.fechaFin, 'yyyy-MM-ddTHH:mm:ss')!,
      categoriaId: this.filtro.categoriaId,
      sector: this.filtro.sector
    };
    
    this.reportService.descargarInformePDF(params).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `informe_${new Date().toISOString()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error al descargar PDF:', err)
    });
  }
}