import { mapUserToEmailSignIn } from './../Utils/user-dto';
import {Injectable} from '@angular/core';
import {BehaviorSubject, first, Observable, Subject, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import Firebase from "firebase/compat";
import firebaseUser = Firebase.User;
import { User } from "../Models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user$: BehaviorSubject<firebaseUser> = new BehaviorSubject<firebaseUser>(null);
  get user$(): Observable<firebaseUser> {
    return this._user$.asObservable()
  }

  private _token$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  get token$(): Observable<string> {
    return this._token$.asObservable();
  }

  constructor(private angularAuth: AngularFireAuth, private httpclient: HttpClient) {
    this.angularAuth.authState.subscribe(firebaseUser => {
      // @ts-ignore
      this.user = firebaseUser
      this.configureAuthState(firebaseUser);
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
    const newUser = mapUserToEmailSignIn(user);
    return await this.angularAuth.createUserWithEmailAndPassword(newUser.email, newUser.password)
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

  public isLoggedIn(): Observable<Firebase.User> {
    return this.angularAuth.authState.pipe(first());
  }

  // TODO: Add spinner service to block page while user is loading in
  private async configureAuthState(firebaseUser: firebaseUser | null) {
    if (firebaseUser) {
      console.log("we are signed in")
      const token = await firebaseUser.getIdToken();
      localStorage.setItem("jwt", token);
      this._token$.next(token);
      this._user$.next(firebaseUser);
      console.log(firebaseUser)
    } else {
      console.log("signed out")
      await this.SignOutUser();
    }
  }
}
