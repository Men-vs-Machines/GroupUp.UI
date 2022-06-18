import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import Firebase from "firebase/compat";
import firebaseUser = Firebase.User;
import { User } from "../Models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebaseUser = null;

  private _user$: BehaviorSubject<firebaseUser> = new BehaviorSubject<firebaseUser>(null);
  get user$(): Observable<firebaseUser> {
    return this._user$.asObservable()
  }

  private _token$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  get token$(): Observable<string> {
    return this._token$.asObservable();
  }

  constructor(private angularAuth: AngularFireAuth, private httpclient: HttpClient) {
    this.angularAuth.authState.subscribe(async firebaseUser => {
      // @ts-ignore
      this.user = firebaseUser
      await this.configureAuthState(firebaseUser);
    });
  }

  public async SignOutUser() {
    localStorage.removeItem("jwt");
    this._token$.next(null);
    this._user$.next(null);
    await this.angularAuth.signOut()
  }

  public async signInAnonymousUser() {
    return await this.angularAuth.signInAnonymously();
  }

  // displayName will be mapped to Email
  public async createUserWithEmailAndPassword(user: User) {
    return await this.angularAuth.createUserWithEmailAndPassword(user.displayName, user.password)
  }

  // displayName will be mapped to email
  public async signInUserWithEmailAndPassword(user: User) {
    return await this.angularAuth.signInWithEmailAndPassword(user.displayName, user.password);
  }

  public async setCurrentUserName(username: string, user: firebaseUser) {
    return await user.updateProfile({
      displayName: username
    });
  }

  private async configureAuthState(firebaseUser: firebaseUser | null) {
    if (firebaseUser) {
      console.log("we are signed in")
      firebaseUser.getIdToken().then((theToken) => {
        localStorage.setItem("jwt", theToken);
        this.user = firebaseUser;
        this._token$.next(theToken);
        this._user$.next(firebaseUser);
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
}
