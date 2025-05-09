import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegistroComponent } from '../registro/registro.component';
@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor(private dialog: MatDialog) {}

  abrirLogin(): void {
    this.dialog.open(LoginComponent, {
      width: '90%',
      maxWidth: '400px'
    });
  }

  abrirRegistro(): void {
    this.dialog.open(RegistroComponent, {
      width: '90%',
      maxWidth: '400px'
    });
  }
}
