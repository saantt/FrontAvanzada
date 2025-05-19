// Si no tienes esta interfaz separada, la definimos aquí
interface UbicacionDTO {
  latitud: number;
  longitud: number;
}

export interface ReporteInforme {
  titulo: string;
  descripcion: string;
  fecha: string; // O Date si haces la conversión
  ubicacion: UbicacionDTO;
  nombreCategoria: string;
  importante: boolean;
  estado: string; // O enum si prefieres
}

export interface EstadisticasInforme {
  totalReportes: number;
  reportesImportantes: number;
  reportesPorCategoria: { [key: string]: number }; // Ej: { "Baches": 5 }
  reportesPorEstado: { [key: string]: number };    // Ej: { "PENDIENTE": 3 }
}

export interface InformeGeneradoDTO {
  tituloInforme: string;
  fechaGeneracion: string; // O Date
  periodo: string;
  totalReportes: number;
  reportes: ReporteInforme[];
  estadisticas: EstadisticasInforme;
}

// Para la respuesta completa del API
export interface ApiResponseInforme {
  error: boolean;
  respuesta: InformeGeneradoDTO;
  mensaje?: string | null;
}