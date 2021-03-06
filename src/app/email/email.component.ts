import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../router.animations';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}
})
export class EmailComponent implements OnInit {

    state: string = '';
    error: any;
    email: String;
    password: String;

    constructor(public afAuth: AngularFireAuth,private router: Router) {
      this.afAuth.authState.subscribe(auth => { 
        if(auth) {
          this.router.navigateByUrl('/dashboard');
        }
      });
  }


  onSubmit(formData) {
    if(formData.valid) {
      console.log(formData.value);
      this.afAuth.auth.signInWithPopup(new firebase.auth.EmailAuthProvider()).then(
        (success) => {
        console.log(success);
        this.router.navigate(['/dashboard']);
      }).catch(
        (err) => {
        console.log(err);
        this.error = err;
      })
    }
  }

  ngOnInit() {
  }

}
