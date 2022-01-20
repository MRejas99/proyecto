import { UtilsService } from './../../service/utils.service';
import { ProyectoService } from './../../service/proyecto.service';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reporte-semanal',
  templateUrl: './reporte-semanal.component.html',
  styleUrls: ['./reporte-semanal.component.css']
})
export class ReporteSemanalComponent implements OnInit {
  diario: Observable<any[]>;
  contagiados: any[] = [];
  recuperados: any[] = [];
  fallecidos:any[] = [];
  isDisplayed = false;

  barChartLabels: Label[] = [];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'line';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [{ data: this.contagiados, label: 'Contagiados' },
                                   { data: this.recuperados, label: 'Recuperados' },
                                   { data: this.fallecidos, label: 'Fallecidos' }
  ];

  constructor( private _proyecto: ProyectoService,
               private _utils: UtilsService ) { }

  ngOnInit(): void {
    this.getData();
    setTimeout(() => {
      this.getReporteSemanal();
    }, 300);
  }

  getData() {
    this.diario = this._proyecto.getReporteDiario();
  }

  getReporteSemanal() {
    var limit = 7;
    this.diario.forEach(element => {
      
      if (element.length < 7) {
        limit = element.length;
      }

      this.clearChartData();

      for (let i = 0; i < limit; i++) {
        this.barChartLabels.push(this._utils.getDateFromTimestamp(element[i].fecha));
        this.contagiados.push(element[i].contagiados);
        this.recuperados.push(element[i].recuperados);
        this.fallecidos.push(element[i].fallecidos);
        
      }
      this.barChartLabels.reverse();
      this.contagiados.reverse();
      this.recuperados.reverse();
      this.fallecidos.reverse();
      
    });
  }

  clearChartData() {
    this.barChartLabels = [];
  }
}
