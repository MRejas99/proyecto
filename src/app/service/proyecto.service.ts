import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  
  constructor( private af: AngularFirestore ) { }

  getReporteDiario(): Observable<any[]> {
    return this.af.collection('diario', ref => ref.orderBy('fecha', 'desc')).valueChanges();
  }

  getPaciente(form: any): Observable<any[]> {
    return this.af.collection('pacientes', ref => ref.where('ci', '==', form.ci).where('nacimiento', '==', form.nacimiento)).valueChanges();
  }

  getCiExistente(ci: string): Observable<any[]>  {
    return this.af.collection('pacientes', ref => ref.where('ci', '==', ci)).valueChanges();
  }

  postPaciente(form: any) {
    return this.af.collection('pacientes').add(form);
  }

  postMediciones(form: any) {
    return this.af.collection('medidas').add(form);
  }

  getMediciones(ci: string): Observable<any[]> {
    return this.af.collection('medidas', ref => ref.where('paciente', '==', ci).orderBy('fecha', 'desc')).valueChanges();
  }

  getPacientes(): Observable<any[]> {
    return this.af.collection('pacientes').valueChanges();
  }
}
