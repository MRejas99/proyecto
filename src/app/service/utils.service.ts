import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Timestamp } from "@firebase/firestore";


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private logged = new BehaviorSubject(false);
  isLoggedIn = this.logged.asObservable();

  private email = new BehaviorSubject('');
  ciLoggedIn = this.email.asObservable();

  constructor() { }

  alreadyLogin(email: string, sesion: boolean) {
    this.logged.next(sesion);
    this.email.next(email);
  }

  getDateFromTimestamp (timestamp): string {
    var date = timestamp.toDate();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear();
    let hh = date.getHours();
    let mi = date.getMinutes();
    let ss = date.getSeconds();

    if(mi < 10) {
      mi = `0${mi}`;
    }
    if(ss < 10) {
      ss = `0${ss}`;
    }
    
    if(mm < 10){
      return `${dd}/0${mm}/${yy} ${hh}:${mi}:${ss}`;
    } else{
      return `${dd}/${mm}/${yy} ${hh}:${mi}:${ss}`;
    }
  }

  getDayFromTimestamp (timestamp): string {
    var date = timestamp.toDate();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear();
    
    /*if(mm < 10){
      return `${dd}/0${mm}/${yy}`;
    } else{
      return `${dd}/${mm}/${yy}`;
    }*/
    return dd;
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
    localStorage.clear();
  }
}
