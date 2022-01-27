import { Medida } from './../../interface/medida';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from './../../service/utils.service';
import { ProyectoService } from './../../service/proyecto.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  mediciones: Observable<any[]>;
  medidas: Medida[] = [];
  paciente: Observable<any[]>;
  pacienteForm: FormGroup;
  buscado = false;
  buscando = false;

  constructor( private _proyecto: ProyectoService,
               private _utils: UtilsService,
               private fb: FormBuilder,
               private toastr: ToastrService ) { 
    this.pacienteForm = this.fb.group({
      ci: ['', Validators.required],
      nacimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  buscarPaciente() {
    this.buscando = true;
    if (this.pacienteForm.invalid) {
      this.toastr.error('Todos los campos son requeridos', 'Ha ocurrido un error');
      this.buscando = false;
      return;
    }
    this.verificarExistenciaPaciente();
  }

  verificarExistenciaPaciente() {
    this._proyecto.getPaciente(this.pacienteForm.value).pipe(take(1)).subscribe( p => {
      if (p.length > 0) {
        this.mediciones = this._proyecto.getMediciones(p[0].ci);
        setTimeout(() => {
          this.mediciones.forEach(element => {
            this.medidas = [];
            for (let i = 0; i < element.length; i++) {
              this.medidas.push({paciente: element[i].paciente,
                                 fecha: this._utils.getDateFromTimestamp(element[i].fecha), 
                                 temp: element[i].temperatura, 
                                 spo2: element[i].spo2, 
                                 card: element[i].cardiaco, 
                                 resp: element[i].respiratorio});
            }
            this.buscado = true;
            this.buscando = false;
          });
        }, 300);
      }
      else {
        this.toastr.error('Revise los datos ingresados', 'Paciente inexistente');
        this.buscando = false;
        return;
      }
    })
  }
}
