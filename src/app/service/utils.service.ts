import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

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
}
