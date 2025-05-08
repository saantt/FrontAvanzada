import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

interface Reporte {
  id: string;
  titulo: string;
  categoria: string;
  estado: 'pendiente' | 'verificado' | 'rechazado' | 'resuelto';
  fecha: Date;
  usuario: string;
  ubicacion: string;
  descripcion: string;
  imagenes?: { url: string }[];
}

@Component({
  selector: 'app-detalle-reporte',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.css']
})
export class DetalleReporteComponent {
  constructor(
    public dialogRef: MatDialogRef<DetalleReporteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reporte: Reporte }
  ) {}

  ampliarImagen(url: string): void {
    // Implementar lógica para ampliar imagen
    window.open(url, '_blank');
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}