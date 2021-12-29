import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app/dist/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentUser } from '../Models/currentuser';
import { HttpClient } from '@angular/common/http';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormGroup} from "@angular/forms";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(new CurrentUser());

  constructor(private angularAuth: AngularFireAuth, private httpclient: HttpClient) {
    this.angularAuth.authState.subscribe(firebaseUser => {
      // @ts-ignore
      this.configureAuthState(firebaseUser);
    });
  }

  async configureAuthState(firebaseUser: firebase.User) {
    console.log(`Inside the auth-service, the firebase user is:`)
    console.log(firebaseUser)
    if (firebaseUser) {
      firebaseUser.getIdToken().then((theToken) => {
        console.log('we have a token: ');
        console.log(theToken);
        localStorage.setItem("jwt", theToken);
        this.user$.next(firebaseUser);
      }, async (failReason) => {
        await this.doSignedOutUser();
      });
    } else {
      await this.doSignedOutUser();
    }
  }

  async doSignedOutUser() {
    let theUser = new CurrentUser();
    theUser.displayName = null;
    theUser.isSignedIn = false;
    localStorage.removeItem("jwt");
    this.user$.next(theUser);
    await this.angularAuth.signOut()
  }

  logout(): Promise<void> {
    return this.angularAuth.signOut();
  }

  getUserobservable(): Observable<CurrentUser> {
    return this.user$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem("jwt");
  }

  async signIn(form: FormGroup) {
    const email = form.value['Username'] + '@example.com';
    const password = form.value['Password'];
    console.log(email,  password)
    const result =  await this.angularAuth.signInWithEmailAndPassword(email, password);
    console.log(result);
  }

  async getAllUsers() {
    return this.httpclient.get(`${environment.secretSantaAPI}/Users`).subscribe(x => console.log(x));
  }
}
