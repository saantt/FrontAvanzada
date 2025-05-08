import { Routes } from '@angular/router';

// Authentication related components
import { LoginComponent } from './Paginas/login/login.component';
import { RegistroComponent } from './Paginas/registro/registro.component';
import { RecuperarContraseniaComponent } from './Paginas/recuperar-contrasenia/recuperar-contrasenia.component';
import { ActivacionCuentaComponent } from './Paginas/activacion-cuenta/activacion-cuenta.component';

// User account management
import { CuentaComponent } from './Paginas/cuenta/cuenta.component';
import { ConfiguracionComponent } from './Paginas/configuracion/configuracion.component';
import { CambiarContraseniaComponent } from './Paginas/cambiar-contrasenia/cambiar-contrasenia.component';
import { BorrarCuentaComponent } from './Paginas/borrar-cuenta/borrar-cuenta.component';

// Report management
import { FormularioComponent } from './Paginas/formulario/formulario.component';
import { ReportesComponent } from './Paginas/reportes/reportes.component';
import { MisReportesComponent } from './Paginas/mis-reportes/mis-reportes.component';
import { ComentariosComponent } from './Paginas/comentarios/comentarios.component';
import { NotificacionesComponent } from './Paginas/notificaciones/notificaciones.component';

// Admin specific components
import { InicioAdminComponent } from './Paginas/inicio-admin/inicio-admin.component';
import { CuentaAdminComponent } from './Paginas/cuenta-admin/cuenta-admin.component';
import { PanelUsuariosComponent } from './Paginas/panel-usuarios/panel-usuarios.component';
import { VerReportesAdminComponent } from './Paginas/ver-reportes-admin/ver-reportes-admin.component';
import { GestionReportesComponent } from './Paginas/gestion-reportes/gestion-reportes.component';
import { GenerarInformesComponent } from './Paginas/generar-informes/generar-informes.component';

// Core pages
import { InicioComponent } from './Paginas/inicio/inicio.component';

export const routes: Routes = [
  // Core routes
  { path: '', component: InicioComponent },
  
  // Authentication routes
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-contrasenia', component: RecuperarContraseniaComponent },
  { path: 'activacion-cuenta', component: ActivacionCuentaComponent },
  
  // User account routes
  { path: 'cuenta', component: CuentaComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent },
  { path: 'borrar-cuenta', component: BorrarCuentaComponent },
  
  // Report routes
  { path: 'formulario', component: FormularioComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'mis-reportes', component: MisReportesComponent },
  { path: 'comentarios', component: ComentariosComponent },
  { path: 'notificaciones', component: NotificacionesComponent },
  
  // Admin routes
  { path: 'inicio-admin', component: InicioAdminComponent },
  { path: 'cuenta-admin', component: CuentaAdminComponent },
  { path: 'panel-usuarios', component: PanelUsuariosComponent },
  { path: 'ver-reportes-admin', component: VerReportesAdminComponent },
  { path: 'gestion-reportes', component: GestionReportesComponent },
  { path: 'generar-informes', component: GenerarInformesComponent },
  
  // Fallback route
  { path: '**', redirectTo: '' }
];