import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor( private af: AngularFirestore ) { }

  getDiario(date: String): Observable<any[]> {
    return this.af.collection('diario', ref => ref.where('fecha', '==', date)).valueChanges();
  }
}
