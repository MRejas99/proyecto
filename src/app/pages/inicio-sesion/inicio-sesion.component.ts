import { AuthService } from './../../service/auth.service';
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
  registroForm: FormGroup;
  latitud = 0;
  longitud = 0;
  buscando = false;
  registrando = false;

  constructor( private _proyecto: ProyectoService,
               private _utils: UtilsService,
               private _auth: AuthService,
               private fb: FormBuilder,
               private toastr: ToastrService,
               private router: Router ) { 

    this.pacienteForm = this.fb.group({
      email: ['', Validators.required],
      pass: ['', Validators.required]
    });

    this.registroForm = this.fb.group({
      email: ['', Validators.required],
      pass: ['', Validators.required],
      confirmar: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      ci: ['', Validators.required],
      nacimiento: ['', Validators.required],
      telefono: ['', Validators.required],
      emergencia: ['', Validators.required],
      pcr: [false],
      antigeno: [false]
    });
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

  registrarPaciente() {
    this.registrando = true;
    if (this.registroForm.invalid) {
      this.toastr.error('Todos los campos son requeridos', 'Error');
      this.registrando = false;
      return;
    }
    if(this.latitud === 0) {
      this.toastr.warning('Es necesario que otorgue los permisos de ubicación', 'Atención');
      this.registrando = false;
      return;
    }
    else {
      if ( this.registroForm.value.pass !== this.registroForm.value.confirmar ) {
        this.toastr.error('Las contraseñas no coinciden', 'Error');
        this.registrando = false;
        return;
      }
      this.guardarPaciente();
    }
  }

  guardarPaciente() {
    this.registroForm.removeControl('confirmar');
    this.registroForm.value.latitud = this.latitud;
    this.registroForm.value.longitud = this.longitud;
    if (this.registroForm.value.pcr == true || this.registroForm.value.antigeno == true) {
      this.registroForm.value.estado = "CONTAGIADO";
    }
    else {
      this.registroForm.value.estado = "RECUPERADO";
    }
    console.log(this.registroForm.value);
    this._auth.createUserWithEmail(this.registroForm.value.email, this.registroForm.value.pass).then(userData => {
      userData.user.getIdTokenResult().then( dat => {
        this._proyecto.postPaciente(this.registroForm.value);
        this.pacienteAutenticado(this.registroForm.value.email, this.registroForm.value.ci, dat.token);
      });
    }).catch(error => {
      console.log(error);
      this.toastr.error('No se pudo completar el registro. Intente nuevamente por favor', 'Error');
    });
    
    this.registrando = false;
  }

  login() {
    this.buscando = true;
    if (this.pacienteForm.invalid) {
      this.toastr.error('Todos los campos son requeridos', 'Ha ocurrido un error');
      this.buscando = false;
      return;
    }
    if(this.latitud === 0) {
      this.toastr.warning('Es necesario que otorgue los permisos de ubicación', 'Atención');
      this.buscando = false;
      return;
    }
    else {
      this._auth.signInWithEmail(this.pacienteForm.value.email, this.pacienteForm.value.pass).then(userData => {
        userData.user.getIdTokenResult().then(dat => { 
          var pa = this._proyecto.getPacientePorEmail(this.pacienteForm.value.email).subscribe( p => {
            if (p.length > 0) {
              this.pacienteAutenticado(this.pacienteForm.value.email, p[0].ci, dat.token);
            }
            else {
              this.toastr.error('Verifique las credenciales ingresadas', 'Acceso denegado');
              this.buscando = false;
            }
          });
        });
        this.buscando = false
      })
      .catch(err => {
        //console.log('Ocurrio un error', err.message);
        this.toastr.error('Verifique las credenciales ingresadas', 'Acceso denegado');
        this.buscando = false;
      });
    }
  }

  pacienteAutenticado(email: string, ci: string, token: string) {
    this.buscando = false;
    this._utils.saveLocalData('access-token', token);
    this._utils.saveLocalData('ci', ci);
    this._utils.saveLocalData('email', email);
    this._utils.alreadyLogin(email, true);
    this.router.navigateByUrl('/sintomas');
  }

}

