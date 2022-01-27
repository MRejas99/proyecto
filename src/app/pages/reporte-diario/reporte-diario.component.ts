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
  contagiadosSistema = 0;
  recuperadosSistema = 0;
  fallecidosSistema = 0;
  hayContagiados = false;
  hayRecuperados = false;
  hayFallecidos = false;
  fecha = "";

  constructor( private _proyecto: ProyectoService,
               private _utils: UtilsService) { 
    this.getContagiadosHoy();
    this.getRecuperadosHoy();
    this.getFallecidosHoy();
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
      this.fecha = this._utils.getStringDateFromTimestamp(element[0].fecha);
      this.reporteDiario = element[0];
      this.hayDiario = true;
    });
  }

  getContagiadosHoy() {
    this._proyecto.getEstadoFecha("CONTAGIADO", this._utils.getTimestampDate()).subscribe( cont => {
      this.contagiadosSistema = cont.length;
      this.hayContagiados = true;
    });
  }

  getRecuperadosHoy() {
    this._proyecto.getEstadoFecha("RECUPERADO", this._utils.getTimestampDate()).subscribe( cont => {
      this.recuperadosSistema = cont.length;
      this.hayRecuperados = true;
    });
  }

  getFallecidosHoy() {
    this._proyecto.getEstadoFecha("FALLECIDO", this._utils.getTimestampDate()).subscribe( cont => {
      this.fallecidosSistema = cont.length;
      this.hayFallecidos = true;
    });
  }
}
