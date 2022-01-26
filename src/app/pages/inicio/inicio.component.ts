import { Observable } from 'rxjs';
import { ProyectoService } from './../../service/proyecto.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;
  google: any;
  zoom: number = 12;
  lat: number = -16.4957706;
  lng: number = -68.14333;
  pacientes: Observable<any[]>;

  constructor( private _proyecto: ProyectoService ) { }

  ngOnInit(): void {
  }

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;
    const coords: google.maps.LatLng[] = [];

    this.pacientes = this._proyecto.getPacientesEstado("CONTAGIADO");
    setTimeout(() => {
      this.pacientes.forEach(element => {
        for (let i = 0; i < element.length; i++) {
          coords.push(new google.maps.LatLng(element[i].latitud, element[i].longitud));
        }
        this.heatmap = new google.maps.visualization.HeatmapLayer({
          map: this.map,
          data: coords
      });
      });
    }, 400);
  }
  
}
