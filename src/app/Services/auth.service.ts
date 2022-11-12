import { mapUserToEmailSignIn } from './../Utils/user-dto';
import {Injectable} from '@angular/core';
import { BehaviorSubject, concatMap, delay, EMPTY, first, forkJoin, iif, mergeMap, Observable, of, Subject, switchMap, tap, take, from, map } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import Firebase from "firebase/compat";
import firebaseUser = Firebase.User;
import { User } from "../Models/user";
import { DataProviderService } from 'src/app/Services/data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  get user$(): Observable<User> {
    return this._user$.asObservable()
  }

  private _token$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  get token$(): Observable<string> {
    return this._token$.asObservable();
  }

  constructor(private angularAuth: AngularFireAuth, private dataProviderService: DataProviderService) {
    this.angularAuth.authState.pipe(
      tap((user) => console.log('auth state changed', user)),
      switchMap((firebaseUser: firebaseUser | null) => {
        if (!!firebaseUser) {
          return this.onUserSignIn$(firebaseUser);
        }

        return this.onUserSignOut$();
      }))
    .subscribe();
  }

  public signOutUser$() {
    return this.onUserSignOut$();
  }

  // displayName will be mapped to Email
  public createUserWithEmailAndPassword(user: User) {
    const newUser = mapUserToEmailSignIn(user);
   
    from(this.angularAuth.createUserWithEmailAndPassword(newUser.email, newUser.password)).pipe(
      map((userCredential) => ({...newUser, id: userCredential.user.uid})),
      tap(data => console.log('the new user is', data)),
      switchMap((user) => this.dataProviderService.createUser(user)),
      // Delay to avoid timing issues with authstate
      delay(100)
    ).subscribe();
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

  private onUserSignOut$(): Observable<void> {
    return of(null).pipe(
      tap(() => {
        this._token$.next(null);
        this._user$.next(null);
        localStorage.removeItem("jwt");
      }),
      switchMap(() => from(this.angularAuth.signOut())),
    );
  }

  private onUserSignIn$(firebaseUser: firebaseUser | null): Observable<{ user: { displayName?: string; password?: string; wishList?: string[]; id?: string; email?: string; groups?: string[]; }; token: string; }> {
    return forkJoin({
      user: this.dataProviderService.getUser(firebaseUser.uid),
      token: from(firebaseUser.getIdToken())
    }).pipe(
      tap(({user, token}) => {
        this._user$.next(user);
        this._token$.next(token);
        localStorage.setItem("jwt", token);
      }),
      tap(({user, token}) => console.log("user and token", user, token)))
  }

  // TODO: Add spinner service to block page while user is loading in
  // private async configureAuthState(firebaseUser: firebaseUser | null) {
  //   if (firebaseUser) {
  //     console.log("we are signed in")
  //     const token = await firebaseUser.getIdToken();
  //     localStorage.setItem("jwt", token);
  //     const user = this.dataProviderService.getUser(firebaseUser.uid);
  //     this._token$.next(token);
  //     // this._user$.next(user);
  //     console.log(firebaseUser)
  //   } else {
  //     console.log("signed out")
  //     await this.signOutUser();
  //   }
  // }
}
