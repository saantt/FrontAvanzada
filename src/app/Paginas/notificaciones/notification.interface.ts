export interface Notification {
    id: string;
    userId: string;
    reportId?: string; // Opcional, ya que no todas las notificaciones están relacionadas con un reporte
    type: string; // Tipo de notificación (e.g., 'Nuevo Reporte', 'Nuevo Comentario')
    message: string;
    createdAt: Date;
    read: boolean;
  }