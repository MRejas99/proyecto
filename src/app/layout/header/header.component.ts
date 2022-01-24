import { Router } from '@angular/router';
import { UtilsService } from './../../service/utils.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  ciPaciente = '';
  sesionIniciada = false;

  constructor( private _utils: UtilsService,
               private router: Router ) { 
    _utils.isLoggedIn.subscribe(status => this.sesionIniciada = status);
    _utils.ciLoggedIn.subscribe(status => this.ciPaciente = status);
  }

  ngOnInit(): void {
  }

  logout() {
    this._utils.clearLocalStorage();
    this._utils.alreadyLogin('', false);
    this.router.navigateByUrl('/inicio');
  }

  pacienteAutenticado() {
    this.ciPaciente = this._utils.getLocalData('ci');
  }
}
