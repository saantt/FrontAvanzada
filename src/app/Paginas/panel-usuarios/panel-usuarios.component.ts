import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';

interface User {
  nombre: string;
  email: string;
  ciudad: Date;
  telefono: string;
  rol: 'CIUDADANO' | 'ADMINISTRADOR' ;
  estado: string;
}


@Component({
  selector: 'app-panel-usuarios',
  imports: [ CommonModule ],
  templateUrl: './panel-usuarios.component.html',
  styleUrl: './panel-usuarios.component.css'
})
export class PanelUsuariosComponent implements OnInit {
  dataSource = new MatTableDataSource<User>();

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getCurrentUsers().subscribe({
      next: (response) => {
        this.dataSource.data = response;
        return response
      },
      error: (err) => {
        console.error('Error cargando reportes:', err);
      }
    });
  }

}
