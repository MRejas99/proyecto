import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { SintomasComponent } from './pages/sintomas/sintomas.component';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'login',
    component: InicioSesionComponent
  },
  {
    path: 'sintomas',
    component: SintomasComponent
  },
  {
    path: 'pacientes',
    component: PacientesComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
