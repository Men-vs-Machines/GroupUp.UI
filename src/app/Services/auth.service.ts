import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app/dist/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentUser } from '../Models/currentuser';
import { HttpClient } from '@angular/common/http';
import {AngularFireAuth} from "@angular/fire/compat/auth";


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

  configureAuthState(firebaseUser: firebase.User): void {
    console.log(`Inside the auth-service, the firebase user is: ${firebaseUser}`)
    if (firebaseUser) {
      firebaseUser.getIdToken().then((theToken) => {
        console.log('we have a token');
        this.httpclient.post('/api/users/verify', { token: theToken }).subscribe({
          next: () => {
            let theUser = new CurrentUser();
            theUser.displayName = firebaseUser.displayName;
            theUser.isSignedIn = true;
            localStorage.setItem("jwt", theToken);
            this.user$.next(theUser);
          },
          error: (err) => {
            console.log('inside the error from server', err);
            this.doSignedOutUser()
          }
        });
      }, (failReason) => {
        this.doSignedOutUser();
      });
    } else {
      this.doSignedOutUser();
    }
  }

  private doSignedOutUser() {
    let theUser = new CurrentUser();
    theUser.displayName = null;
    theUser.isSignedIn = false;
    localStorage.removeItem("jwt");
    this.user$.next(theUser);
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

  // getUserSecrets(): Observable<string[]> {
  //   return this.httpclient.get("/api/users/secrets").pipe(map((resp: string[]) => resp));
  // }
}
