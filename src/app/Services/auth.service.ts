import { mapUserToEmailSignIn } from './../Utils/user-dto';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  delay,
  EMPTY,
  first,
  forkJoin,
  iif,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  take,
  from,
  map,
  shareReplay,
  repeatWhen,
  retryWhen,
  defer,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Firebase from 'firebase/compat';
import firebaseUser = Firebase.User;
import { User } from '../Models/user';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { ReplaySubject } from 'rxjs';
import { UserService } from './user.service';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  get token$(): Observable<string> {
    return this._token$.asObservable();
  }

  constructor(
    private angularAuth: AngularFireAuth,
    private dataProviderService: DataProviderService,
    private userService: UserService
  ) {
    this.angularAuth.authState
      .pipe(
        tap((user) => console.log('auth state changed', user)),
        switchMap((user: Firebase.User | null) =>
          defer(() =>
            !!user ? this.onUserSignIn$(user) : this.onUserSignOut$()
          )
        )
      )
      .subscribe();
  }

  public signOutUser$() {
    return this.onUserSignOut$();
  }

  // displayName will be mapped to Email
  public createUserWithEmailAndPassword$(user: User): Observable<unknown> {
    const newUser = mapUserToEmailSignIn(user);

    return from(
      this.angularAuth.createUserWithEmailAndPassword(
        newUser.email,
        user.password
      )
    ).pipe(
      map((userCredential) => ({ ...newUser, id: userCredential.user.uid })),
      switchMap((user) => this.dataProviderService.createUser(user))
    );
  }

  public signInWithUsernameAndPassword$(user: User): Observable<unknown> {
    const newUser = mapUserToEmailSignIn(user);

    return from(
      this.angularAuth.signInWithEmailAndPassword(
        newUser.email,
        user.password
      )
    ).pipe(
      map((userCredential) => ({ ...newUser, id: userCredential.user.uid })),
      switchMap((user) => this.dataProviderService.getUser(user.id))
    );
  }

  // displayName will be mapped to email
  public async signInUserWithEmailAndPassword(user: User) {
    return await this.angularAuth.signInWithEmailAndPassword(
      user.displayName,
      user.password
    );
  }

  public async setCurrentUserName(username: string, user: firebaseUser) {
    return await user.updateProfile({
      displayName: username,
    });
  }

  public checkToken() {
    return this.token$.pipe(first());
  }

  public isLoggedIn(): Observable<Firebase.User> {
    return this.angularAuth.authState.pipe(first());
  }

  private onUserSignOut$(): Observable<void> {
    return of(null).pipe(
      tap(() => {
        this._token$.next(null);
        this.userService.setUser = null;
        localStorage.removeItem('jwt');
      }),
      switchMap(() => from(this.angularAuth.signOut()))
    );
  }

  private onUserSignIn$(
    firebaseUser: firebaseUser | null
  ): Observable<{ user: User; token: string }> {
    return forkJoin({
      user: this.userService.getUser(firebaseUser.uid).pipe(
        // To keep auth state in sync, we need to make sure that the user is created in the backend
        retryWhen((errors) => errors.pipe(delay(500), take(3)))
      ),
      token: from(firebaseUser.getIdToken()),
    }).pipe(
      tap(({ user, token }) => {
        this.userService.setUser = user;
        this._token$.next(token);
        localStorage.setItem('jwt', token);
      })
    );
  }
}
