import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject, ReplaySubject, takeUntil, distinctUntilChanged, switchMap, take } from 'rxjs';
import { User } from 'src/app/Models/user';
import { Destroyable } from 'src/app/Utils/destroyable';
import { DataProviderService } from './data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends Destroyable {
  private userSub = new ReplaySubject<User>(1);
  private userTriggerSub = new Subject<void>();
  user$ = this.userSub.asObservable();
  
  
  set setUser(user: User) {
    this.userSub.next(user);
  }
  
  constructor(private dataProviderService: DataProviderService, private af: AngularFireAuth) {
    super();
  }

  public fetchUser() {
    this.userTriggerSub.next();
  }

  private getUser$() {
    this.userTriggerSub.pipe(
      switchMap(() => this.onUserTrigger()),
      take(1)
    ).subscribe({
      next: (user) => {
        console.log(user)
        this.userSub.next(user);
      }
    });

  }

  private onUserTrigger() {
    return this.af.authState.pipe(
      switchMap((user) => this.dataProviderService.getUser(user.uid)),
      distinctUntilChanged(),
      takeUntil(this.destroy$))
  }
}
