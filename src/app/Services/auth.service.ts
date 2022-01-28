import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormGroup} from "@angular/forms";
import {environment} from "../../environments/environment";
import Firebase from "firebase/compat";
import User = Firebase.User;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User = null;

  private _user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  get user$(): Observable<User> {
    return this._user$.asObservable()
  }

  private _token$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
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
      console.log("we are signed in")
      firebaseUser.getIdToken().then((theToken) => {
        localStorage.setItem("jwt", theToken);
        this._token$.next(theToken);
        this._user$.next(firebaseUser);
        this.user = firebaseUser;
        console.log(firebaseUser)
      }, async () => {
        console.log("signed out")
        await this.SignOutUser();
      });
    } else {
      console.log("signed out")
      await this.SignOutUser();
    }
  }

  async SignOutUser() {
    // Comment these out to see if we can just push a null value instead
    // let theUser = new CurrentUser();
    // theUser.displayName = null;
    // theUser.isSignedIn = false;
    localStorage.removeItem("jwt");
    this._token$.next(null);
    this._user$.next(null);
    await this.angularAuth.signOut()
  }

  logout(): Promise<void> {
    return this.angularAuth.signOut();
  }

  async signInAnonymousUser() {
    return await this.angularAuth.signInAnonymously();
  }

  async getAllUsers() {
    return this.httpclient.get(`${environment.GroupUpAPI}/Groups`).subscribe(x => console.log(x));
  }

  async setCurrentUserName(loginForm: FormGroup) {
    const username = loginForm['Username'];
    return await this.user.updateProfile({
      displayName: username
    });
  }
}
