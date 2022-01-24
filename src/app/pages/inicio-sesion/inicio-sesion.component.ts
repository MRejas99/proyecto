import { UtilsService } from './../../service/utils.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from './../../service/proyecto.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {
  paciente: Observable<any[]>;
  pacienteCi: Observable<any[]>;
  pacienteForm: FormGroup;
  latitud = 0;
  longitud = 0;

  constructor( private _proyecto: ProyectoService,
               private _utils: UtilsService,
               private fb: FormBuilder,
               private toastr: ToastrService,
               private router: Router ) { 

    this.pacienteForm = this.fb.group({
      ci: ['', Validators.required],
      nacimiento: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getPosition().subscribe(pos => {
      this.latitud = pos.coords.latitude;
      this.longitud = pos.coords.longitude;
    });
  }

  getPosition(): Observable<any> {
    return Observable.create(observer => {
      window.navigator.geolocation.getCurrentPosition(position => {
        observer.next(position);
        observer.complete();
      },
        error => observer.error(error));
    });
  }

  verificarPaciente() {
    if (this.pacienteForm.invalid) {
      this.toastr.error('Todos los campos son requeridos', 'Ha ocurrido un error');
      return;
    }
    if(this.latitud === 0) {
      this.toastr.warning('Es necesario que otorgue los permisos de ubicación', 'Atención');
      return;
    }
    else {
      this.verificarExistenciaPaciente();
    }
  }

  guardarPaciente(form: any) {
    this.pacienteForm.value.latitud = this.latitud;
    this.pacienteForm.value.longitud = this.longitud;
    this._proyecto.postPaciente(form);
    this.pacienteAutenticado(form.ci, form.nacimiento);
  }

  pacienteAutenticado(ci: string, nac: string) {
    this._utils.saveLocalData('ci', ci);
    this._utils.saveLocalData('nac', nac);
    this._utils.alreadyLogin(ci, true);
    this.router.navigateByUrl('/sintomas');
  }

  verificarExistenciaPaciente() {
    this._proyecto.getPaciente(this.pacienteForm.value).pipe(take(1)).subscribe( p => {
      if (p.length > 0) {
        this.pacienteAutenticado(p[0].ci, p[0].nacimiento);
      }
      else {
        this.verificarCiPaciente(this.pacienteForm.value.ci);
      }
    });
  }

  verificarCiPaciente(ci: string) {
    this._proyecto.getCiExistente(ci).pipe(take(1)).subscribe( p => {
      if (p.length > 0) {
        this.toastr.error('El número de CI ya existe pero no coincide con la fecha de nacimiento', 'Ha ocurrido un error');
        return
      }
      else {
        this.guardarPaciente(this.pacienteForm.value);
      }
    });
  }
}

