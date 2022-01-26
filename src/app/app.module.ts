import { AgmCoreModule } from '@agm/core';
import { environment } from './../environments/environment.prod';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { HeaderComponent } from './layout/header/header.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';
import { ReporteDiarioComponent } from './pages/reporte-diario/reporte-diario.component';
import { ReporteSemanalComponent } from './pages/reporte-semanal/reporte-semanal.component';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { SintomasComponent } from './pages/sintomas/sintomas.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    HeaderComponent,
    FooterComponent,
    ReporteDiarioComponent,
    ReporteSemanalComponent,
    InicioSesionComponent,
    SintomasComponent,
    PacientesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ChartsModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyAHjWLR6UClo4KMMhGa3T8F5iKF4BJes8E',
      libraries: ['visualization'],
    })
  ],
  providers: [
    {
      provide: LocationStrategy, 
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }