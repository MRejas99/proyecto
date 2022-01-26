import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UtilsService } from './../../service/utils.service';
import { ProyectoService } from './../../service/proyecto.service';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-sintomas',
  templateUrl: './sintomas.component.html',
  styleUrls: ['./sintomas.component.css']
})
export class SintomasComponent implements OnInit {
  cargado = false;
  estadoForm: FormGroup;
  
  t = 0;
  s = 0;
  c = 0;
  r = 0;

  medidas: Observable<any[]>;
  temp: any[] = [];
  spo2: any[] = [];
  card: any[] = [];
  resp: any[] = [];

  id = '';
  cambiando = false;

  barChartLabels: Label[] = [];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'line';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [{ data: this.temp, label: 'Temperatura' },
                                   { data: this.spo2, label: 'SPO2' },
                                   { data: this.card, label: 'R. cardíaco' },
                                   { data: this.resp, label: 'R. respiratorio' }
  ];


  constructor( private _proyecto: ProyectoService, 
               private _utils: UtilsService,
               private toastr: ToastrService,
               private fb: FormBuilder) {
    this.estadoForm = this.fb.group({
      estado: ['', Validators.required]
    });  
    this.getPaciente();   
  }

  ngOnInit(): void {
    this.getData();
    setTimeout(() => {
      this.getMediciones();
    }, 500);
  }

  getData() {
    this.medidas = this._proyecto.getMediciones(this._utils.getLocalData('ci'));
  }

  getMediciones() {
    var limit = 10;
    this.medidas.forEach(element => {
      if (element.length < 7) {
        limit = element.length;
      }
      this.clearChartData();
      this.t = element[0].temperatura;
      this.s = element[0].spo2;
      this.c = element[0].cardiaco;
      this.r = element[0].respiratorio;
      for (let i = 0; i < limit; i++) {
        this.barChartLabels.push(this._utils.getDateFromTimestamp(element[i].fecha));
        this.temp.push(element[i].temperatura);
        this.spo2.push(element[i].spo2);
        this.card.push(element[i].cardiaco);
        this.resp.push(element[i].respiratorio);
      }
      this.barChartLabels.reverse();
      this.temp.reverse();
      this.spo2.reverse();
      this.card.reverse();
      this.resp.reverse();
      this.cargado = true;
    });
  }

  clearChartData() {
    this.barChartLabels = [];
  }

  getPaciente() {
    this._proyecto.getPacientePorEmail(this._utils.getLocalData('email')).subscribe( p => {
      if (p.length > 0) {
        this.id = p[0].id;
        this.estadoForm = this.fb.group({
          estado: [p[0].estado, Validators.required]
        }); 
      }
    });
  }

  cambiarEstado() {
    this.cambiando = true;
    if(this.estadoForm.invalid) {
      this.toastr.error('Debe seleccionar el estado al que desea cambiar', 'Error');
      return;
    }
    this._proyecto.updateEstado(this.id, this.estadoForm.value.estado).then( c => {
      this.toastr.success('Estado cambiado a ' + this.estadoForm.value.estado, 'Operación existosa');
      this.cambiando = false;
    })
  }
}
