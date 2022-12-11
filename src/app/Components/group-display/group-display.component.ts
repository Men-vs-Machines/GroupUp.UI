import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  shareReplay,
  tap,
  mergeMap,
  forkJoin,
  combineLatest,
  of,
  map,
  filter,
  take,
  from,
  toArray,
  BehaviorSubject,
} from 'rxjs';
import { Group } from '../../Models/group';
import { Utility } from 'src/app/Utils/utility';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-group-display',
  templateUrl: './group-display.component.html',
  styleUrls: ['./group-display.component.scss'],
})
export class GroupDisplayComponent extends Utility implements OnInit {
  group$: Observable<Group>;
  private userSub = new BehaviorSubject<User[]>(null);
  users$ = this.userSub.asObservable();
  // ViewModel
  vm$: Observable<{ includes: boolean; user: User }>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataProviderService: DataProviderService,
    protected override angularFireAuth: AngularFireAuth,
    protected override router: Router,
    private userService: UserService
  ) {
    super(router, angularFireAuth);
  }

  ngOnInit(): void {
    // TODO: Refactor to use streams
    const groupId = this.activatedRoute.snapshot.params['id'];

    this.group$ = this.dataProviderService
      .getGroup(groupId)
      .pipe(shareReplay(1));

    // TODO: Refactor to use vm for entire template
    this.vm$ = combineLatest([this.userService.user$, this.users$]).pipe(
      filter(([user]) => !!user),
      map(([user, users]) => {
        return { includes: !!users.find((u) => u.id === user.id), user };
      })
    );

    combineLatest([this.userService.user$, this.group$])
      .pipe(
        filter(([user, _]) => !!user),
        mergeMap(([user, { userIds }]) =>
          this.checkIfShouldGetUser(user, userIds)
        )
      )
      .subscribe(this.userSub);
  }

  joinGroup() {
    forkJoin([this.addUserToUsers(), this.updateUserAndGroup()])
      .pipe(take(1))
      .subscribe();
  }

  private updateUserAndGroup() {
    return combineLatest([this.userService.user$, this.group$]).pipe(
      map(([user, group]) => this.newUserGroup(user, group)),
      mergeMap(({ user, group }) =>
        forkJoin([
          this.dataProviderService.updateUser(user),
          this.dataProviderService.updateGroup(group),
        ])
      )
    );
  }

  private addUserToUsers() {
    return combineLatest([this.userService.user$, this.users$]).pipe(
      map(([user, users]) => [...users, user]),
      take(1),
      // Moving the take below this tap causes infinte loop. has to be a better way to do this...
      tap((users) => this.userSub.next(users))
    );
  }

  private newUserGroup(user: User, group: Group): { user: User; group: Group } {
    return {
      user: { ...user, groups: [...user.groups, group.id] },
      group: { ...group, userIds: [...group.userIds, user.id] },
    };
  }

  private checkIfShouldGetUser(
    user: User,
    userIds: string[]
  ): Observable<User[]> {
    // TODO: Optimize this to not fetch current user
    return of(userIds.filter((id) => id !== user.id)).pipe(
      mergeMap((ids) =>
        ids.length > 0
          ? from(userIds).pipe(
              mergeMap((id) => this.userService.getUser(id)),
              toArray()
            )
          : of([user])
      )
    );
  }
}
