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

  getPacientePorEmail(email: string): Observable<any[]> {
    return this.af.collection('pacientes', ref => ref.where('email', '==', email)).valueChanges({idField: 'id'});
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

  getPacientesEstado(estado: string): Observable<any[]> {
    return this.af.collection('pacientes', ref => ref.where('estado', '==', estado)).valueChanges({idField: 'id'});
  }

  updateEstado(id: string, estado: any, fecha: any) {
    return this.af.collection('pacientes').doc(id).update({estado: estado, fecha: fecha});
  }

  getEstadoFecha(estado: string, medianoche: any) {
    return this.af.collection('pacientes', ref => ref.where('estado', '==', estado).where('fecha', '>', medianoche)).valueChanges();
  }

  getMedicionesHaceDosDias(ci: string, fecha: any): Observable<any[]> {
    return this.af.collection('medidas', ref => ref.where('paciente', '==', ci).where('fecha', '>', fecha)).valueChanges();
  }
}
