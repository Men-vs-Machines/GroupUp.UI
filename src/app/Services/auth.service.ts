import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app/dist/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {CurrentUser} from '../Models/currentuser';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormGroup} from "@angular/forms";
import {environment} from "../../environments/environment";
import fbase from "firebase/compat";
import User = fbase.User;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user$: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(new CurrentUser());
  private _token$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private user: User = null;

  get user$(): Observable<CurrentUser> {
    return this._user$.asObservable()
  }

  get token$(): Observable<string> {
    return this._token$.asObservable();
  }

  constructor(private angularAuth: AngularFireAuth, private httpclient: HttpClient) {
    this.angularAuth.authState.subscribe(async firebaseUser => {
      // @ts-ignore
      await this.configureAuthState(firebaseUser);
    });
  }

  async configureAuthState(firebaseUser: User | null) {
    if (firebaseUser) {
      firebaseUser.getIdToken().then((theToken) => {
        localStorage.setItem("jwt", theToken);
        this._token$.next(theToken);
        this._user$.next(firebaseUser);
        this.user = firebaseUser;
        console.log(firebaseUser)
      }, async () => {
        await this.SignOutUser();
      });
    } else {
      await this.SignOutUser();
    }
  }

  async SignOutUser() {
    let theUser = new CurrentUser();
    theUser.displayName = null;
    theUser.isSignedIn = false;
    localStorage.removeItem("jwt");
    this._token$.next(null);
    this._user$.next(theUser);
    await this.angularAuth.signOut()
  }

  logout(): Promise<void> {
    return this.angularAuth.signOut();
  }

  async emailSignIn(form: FormGroup) {
    const email = form.value['Username'] + '@example.com';
    const password = form.value['Password'];
    const result = await this.angularAuth.signInWithEmailAndPassword(email, password);
    console.log(result);
  }

  async signInAnonymousUser() {
    return await this.angularAuth.signInAnonymously();
  }

  async getAllUsers() {
    return this.httpclient.get(`${environment.GroupUpAPI}/Groups`).subscribe(x => console.log(x));
  }

  async setCurrentUserName(loginForm: FormGroup) {
    const username = loginForm['Username']
    console.log(username)
    await this.user.updateProfile({
      displayName: username
    })
  }
}
