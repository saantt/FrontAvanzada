export interface Reporte {
    id: string;
    titulo: string;
    categoria: string;
    fecha: Date;
    estado: string; // 'Pendiente', 'Verificado', 'Rechazado', 'Resuelto'
    // Otros campos relevantes para tu modelo de reporte
  }