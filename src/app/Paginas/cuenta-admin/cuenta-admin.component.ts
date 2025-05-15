import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/usuario.interface'; // Asegúrate de crear esta interfaz
import { Reporte } from '../../interfaces/reporte.interface'; // Asegúrate de crear esta interfaz
import { UserService } from '../../servicios/user.service'; // Asegúrate de crear este servicio
import { ReportService } from '../../servicios/report.service'; // Asegúrate de crear este servicio
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuenta-admin',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './cuenta-admin.component.html',
  styleUrl: './cuenta-admin.component.css'
})
export class CuentaAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  reportes: Reporte[] = [];
  reportesFiltrados: Reporte[] = [];
  terminoBusquedaUsuarios = '';
  terminoBusquedaReportes = '';
  filtroUsuarios = 'todos';
  filtroReportes = 'todos';

  constructor(
    private userService: UserService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarReportes();
  }

  cargarUsuarios(): void {
    this.userService.getUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        this.filtrarUsuarios();
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  cargarReportes(): void {
    this.reportService.getReportes().subscribe(
      (reportes) => {
        this.reportes = reportes;
        this.filtrarReportes();
      },
      (error) => {
        console.error('Error al cargar reportes:', error);
      }
    );
  }

  buscarUsuarios(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.terminoBusquedaUsuarios = target.value;
    this.filtrarUsuarios();
  }

  buscarReportes(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.terminoBusquedaReportes = target.value;
    this.filtrarReportes();
  }

  filtrarUsuarios(filtro: string = this.filtroUsuarios): void {
    this.filtroUsuarios = filtro;
    this.usuariosFiltrados = this.usuarios.filter((usuario) => {
      const nombreCoincide = usuario.nombre
        .toLowerCase()
        .includes(this.terminoBusquedaUsuarios.toLowerCase());
      const filtroActivo =
        filtro === 'todos' ||
        (filtro === 'activos' && usuario.activo) ||
        (filtro === 'inactivos' && !usuario.activo);
      return nombreCoincide && filtroActivo;
    });
  }

  filtrarReportes(filtro: string = this.filtroReportes): void {
    this.filtroReportes = filtro;
    this.reportesFiltrados = this.reportes.filter((reporte) => {
      const tituloCoincide = reporte.titulo
        .toLowerCase()
        .includes(this.terminoBusquedaReportes.toLowerCase());
      const filtroEstado =
        filtro === 'todos'; //|| reporte.estado.toLowerCase() === filtro;
      return tituloCoincide && filtroEstado;
    });
  }

  editarUsuario(id: string): void {
    this.router.navigate(['/admin/editar-usuario', id]);
  }

  eliminarUsuario(id: string): void {
    this.userService.eliminarUsuario(id).subscribe(
      () => {
        this.cargarUsuarios();
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    );
  }

  verReporte(id: string): void {
    this.router.navigate(['/admin/ver-reporte', id]);
  }

  editarReporte(id: string): void {
    this.router.navigate(['/admin/editar-reporte', id]);
  }

  rechazarReporte(id: string): void {
    this.reportService.rechazarReporte(id).subscribe(
      () => {
        this.cargarReportes();
      },
      (error) => {
        console.error('Error al rechazar reporte:', error);
      }
    );
  }

  verificarReporte(id: string): void {
    this.reportService.verificarReporte(id).subscribe(
      () => {
        this.cargarReportes();
      },
      (error) => {
        console.error('Error al verificar reporte:', error);
      }
    );
  }

  marcarResuelto(id: string): void {
    this.reportService.marcarResuelto(id).subscribe(
      () => {
        this.cargarReportes();
      },
      (error) => {
        console.error('Error al marcar como resuelto:', error);
      }
    );
  }
}
