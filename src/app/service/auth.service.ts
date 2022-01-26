import { UtilsService } from './utils.service';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afa: AngularFireAuth,
               private toastr: ToastrService,
               private _utils: UtilsService) { }

  createUserWithEmail(email: string, pass: string) {
    return this.afa.createUserWithEmailAndPassword(email, pass);
  }
  
  signInWithEmail(email: string, pass: string) {
    return this.afa.signInWithEmailAndPassword(email, pass);
  }
}
