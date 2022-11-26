import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  shareReplay,
  Subject,
  tap,
  mergeMap,
  switchMap,
  forkJoin,
  combineLatest,
  of,
  map,
  filter,
  merge,
  takeUntil,
  take,
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
  // TODO: Make behavior subjuct so we can push new users to it
  users$: Observable<User[]>;
  userViewLogic$: Observable<{ includes: boolean; user: User }>;

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

    this.userViewLogic$ = combineLatest([
      this.userService.user$,
      this.group$,
    ]).pipe(
      filter(([user, _]) => !!user),
      // For some reason 'includes' is throwing...
      map(([user, { userIds }]) => {
        return { includes: !!userIds.find((id) => id === user.id), user };
      })
    );

    this.users$ = combineLatest([this.userService.user$, this.group$]).pipe(
      filter(([user, _]) => !!user),
      mergeMap(([user, { userIds }]) =>
        this.checkIfShouldGetUser(user, userIds)
      ),
      shareReplay(1)
    );

    this.users$.subscribe((data) => console.log(data));
  }

  joinGroup() {
    forkJoin([this.updateUserAndGroup(), this.addUserToUsers()])
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
      map(([user, users]) => [...users, user])
      // TODO: Do we need to use a tap here
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
    const users = userIds.filter((id) => user.id !== id);
    return users.length > 0
      ? forkJoin(users.map((id) => this.dataProviderService.getUser(id)))
      : of([user]);
  }
}
