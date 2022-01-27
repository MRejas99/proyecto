import { UtilsService } from './../../service/utils.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProyectoService } from './../../service/proyecto.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sin-registro',
  templateUrl: './sin-registro.component.html',
  styleUrls: ['./sin-registro.component.css']
})
export class SinRegistroComponent implements OnInit {
  pacientes: any[] = []
  sinRegistro: Observable<any[]>;
  estadoForm: FormGroup;
  id = '';

  constructor( private _proyecto: ProyectoService,
               private _utils: UtilsService,
               private fb: FormBuilder,
               private toastr: ToastrService ) {
    this.estadoForm = this.fb.group({
      estado: ['', Validators.required]
    }); 
    this.getPacientes();
  }

  ngOnInit(): void {
  }

  getPacientes() {
    var now = new Date();
    now.setHours(now.getHours() - 48);
    this.pacientes = [];
    this._proyecto.getPacientesEstado("CONTAGIADO").subscribe( pac => {
      pac.forEach( p => {
        this._proyecto.getMedicionesHaceDosDias(p.ci, now).subscribe( med => {
          if (med.length == 0) {
            this.pacientes.push(p);
          }
        });
      });
    });
  }

  openModal(id: string, estado: string) {
    this.id = id;
    this.estadoForm = this.fb.group({
      estado: [estado, Validators.required]
    }); 
  }

  cambiarEstado() {
    if(this.estadoForm.invalid) {
      this.toastr.error('Debe seleccionar el estado al que desea cambiar', 'Error');
      return;
    }
    this._proyecto.updateEstado(this.id, this.estadoForm.value.estado, this._utils.getTodayTimestamp()).then( c => {
      this.toastr.success('Estado cambiado a ' + this.estadoForm.value.estado, 'Operación existosa');
      this.getPacientes();
    });
  }

}
