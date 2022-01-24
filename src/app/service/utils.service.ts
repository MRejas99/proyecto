import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Timestamp } from "@firebase/firestore";


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private logged = new BehaviorSubject(false);
  isLoggedIn = this.logged.asObservable();

  private ci = new BehaviorSubject('');
  ciLoggedIn = this.ci.asObservable();

  constructor() { }

  alreadyLogin(ci: string, sesion: boolean) {
    this.logged.next(sesion);
    this.ci.next(ci);
  }

  getDateFromTimestamp (timestamp): string {
    var date = timestamp.toDate();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear();

    if(mm < 10){
      return `${dd}/0${mm}/${yy}`;
    } else{
      return `${dd}/${mm}/${yy}`;
    }
  }

  getToday(): string {
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear();

    if(mm < 10){
      return `${dd}/0${mm}/${yy}`;
    } else{
      return `${dd}/${mm}/${yy}`;
    }
  }

  getTodayTimestamp() {
    return Timestamp.fromDate(new Date());
  }

  saveLocalData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getLocalData(key: string) {
    return localStorage.getItem(key);
  }

  clearLocalStorage() {
    localStorage.clear;
  }
}
