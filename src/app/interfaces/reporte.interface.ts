export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  clienteId: string;
  ubicacion: {
    latitud: number;
    longitud: number;
  };
  categoriaId: string;
  importante: boolean;
  fotos: string[]; // O puedes usar `File[]` y convertirlas
  }