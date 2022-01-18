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
  
  constructor( private _proyecto: ProyectoService) { 
    
  }

  ngOnInit(): void {
    this.getDiario();
  }

  getDiario() {
    this.diario = this._proyecto.getDiario(this.getToday());
    setTimeout(() => {
      this.diario.forEach(element => {
        this.reporteDiario = element[0];
        this.hayDiario = true;
      });
    }, 300);
  }

  getToday(): String {
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear();

    if(mm < 10){
      return `${dd}/0${mm}/${yy}`;
    }else{
      return `${dd}/${mm}/${yy}`;
    }
  }
}
