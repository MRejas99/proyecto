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
  

  /*clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }*/
  
  /*mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }*/
  
  /*markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  
  markers: marker[] = [
	  {
		  lat: 51.673858,
		  lng: 7.815982,
		  label: 'A',
		  draggable: true
	  },
	  {
		  lat: 51.373858,
		  lng: 7.215982,
		  label: 'B',
		  draggable: false
	  },
	  {
		  lat: 51.723858,
		  lng: 7.895982,
		  label: 'C',
		  draggable: true
	  }
  ]*/

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;
    const coords: google.maps.LatLng[] = [];

    this.pacientes = this._proyecto.getPacientes();
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

    //const coords: google.maps.LatLng[] = [new google.maps.LatLng(-16.4957706,-68.14333)]; // can also be a google.maps.MVCArray with LatLng[] inside    
    /*this.heatmap = new google.maps.visualization.HeatmapLayer({
        map: this.map,
        data: coords
    });*/
  }
  
}
