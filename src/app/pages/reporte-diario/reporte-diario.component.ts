import { UtilsService } from './../../service/utils.service';
import { ProyectoService } from './../../service/proyecto.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reporte-diario',
  templateUrl: './reporte-diario.component.html',
  styleUrls: ['./reporte-diario.component.css']
})
export class ReporteDiarioComponent implements OnInit {

  diario: Observable<any[]>;
  reporteDiario: any;
  hayDiario = false;
  hayContagiados = false;
  fecha = "";

  constructor( private _proyecto: ProyectoService,
               private _utils: UtilsService) { 
    this.getContagiadosHoy();
  }

  ngOnInit(): void {
    this.getData();
    setTimeout(() => {
      this.getReporteDiario();

    },300);
  }

  getData() {
    this.diario = this._proyecto.getReporteDiario();
  }

  getReporteDiario() {
    this.diario.forEach(element => {
      this.fecha = this._utils.getDateFromTimestamp(element[0].fecha);
      this.reporteDiario = element[0];
      this.hayDiario = true;
    });
  }

  getContagiadosHoy() {
    let now = new Date();
    let lastMidnight = now.setHours(0,0,0,0);
    console.log('hoy', lastMidnight);
    this._proyecto.getContagiadosFecha(lastMidnight, new Date()).subscribe( cont => {
      console.log(cont);
      this.hayContagiados = true;
    });
  }
}
