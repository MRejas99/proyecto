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
  fecha = "";

  constructor( private _proyecto: ProyectoService,
               private _utils: UtilsService) { 
    
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
}
