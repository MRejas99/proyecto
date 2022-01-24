import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from './../../service/utils.service';
import { ProyectoService } from './../../service/proyecto.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-sintomas',
  templateUrl: './sintomas.component.html',
  styleUrls: ['./sintomas.component.css']
})
export class SintomasComponent implements OnInit {
  capturando = false;
  tiempoRestante: number = 15;
  intervalo;
  paciente = '';
  sintomasForm: FormGroup;

  medidas: Observable<any[]>;
  temp: any[] = [];
  spo2: any[] = [];
  card: any[] = [];
  resp: any[] = [];

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
               private fb: FormBuilder,
               private toastr: ToastrService,
               private router: Router) { 
    this.sintomasForm = this.fb.group({
      temperatura: ['', Validators.required],
      spo2: ['', Validators.required],
      cardiaco: ['', Validators.required],
      respiratorio: ['', Validators.required]
    });     
  }

  ngOnInit(): void {
    this.getData();
    setTimeout(() => {
      this.getMediciones();
    }, 500);
  }

  iniciarCaptura() {
    this.capturando = true;
    this.tiempoRestante = 15;
    this.intervalo = setInterval(() => {
      if(this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        this.guardarCaptura();
        this.tiempoRestante = 15;
      }
    },1000)
  }

  detenerCaptura() {
    this.capturando = false;
    clearInterval(this.intervalo);
  }

  guardarCaptura() {
    this.paciente = this._utils.getLocalData('ci');
    if (this.paciente !== '') {
      this.sintomasForm.value.paciente = this._utils.getLocalData('ci');
      this.sintomasForm.value.fecha = this._utils.getTodayTimestamp();
      this._proyecto.postMediciones(this.sintomasForm.value);
    }
    else {
      this.toastr.warning('Inicie sesión nuevamente', 'Sesión finalizada');
      this.router.navigateByUrl('/login');
    }
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
    });
  }

  clearChartData() {
    this.barChartLabels = [];
  }
}
