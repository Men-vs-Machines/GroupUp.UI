import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupUpApiService } from '../../Services/group-up-api.service';
import { Destroyable } from '../../Utils/destroyable';
import {
  filter,
  map,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
  tap,
  mergeMap,
  switchMap,
  forkJoin,
  combineLatest,
  of,
  filter,
  merge,
  takeUntil,
  take,
} from 'rxjs';
import { Group } from '../../Models/group';
import { Utility } from 'src/app/Utils/utility';
import { AuthService } from 'src/app/Services/auth.service';
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
  users$: Observable<User[]>;
  includesUser$: Observable<boolean>;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private dataProviderService: DataProviderService,
    protected override angularFireAuth: AngularFireAuth,
    protected override router: Router,
    private userService: UserService
  ) {
    super(router, angularFireAuth);
  }

  ngOnInit(): void {
    const groupId = this._activatedRoute.snapshot.params['id'];

    this.group$ = this.dataProviderService
      .getGroup(groupId)
      .pipe(shareReplay(1));

    this.includesUser$ = combineLatest([
      this.userService.user$,
      this.group$,
    ]).pipe(
      // For some reason 'includes' is throwing...
      map(([{ id }, { userIds }]) => !!userIds.find((userId) => userId === id))
    );

    this.users$ = combineLatest([this.userService.user$, this.group$]).pipe(
      filter(([user, _]) => !!user),
      mergeMap(([user, { userIds }]) =>
        this.checkIfShouldGetUser(user, userIds)
      ),
      shareReplay(1)
    );
  }

  joinGroup() {
    combineLatest([this.userService.user$, this.group$])
      .pipe(
        map(([user, group]) => this.newUser(user, group)),
        mergeMap(({ user, group }) =>
          forkJoin([
            this.dataProviderService.updateUser(user),
            this.dataProviderService.updateGroup(group),
          ])
        )
      )
      // Add logic to re-fetch group on complete
      .subscribe();
  }

  private newUser(user: User, group: Group): { user: User; group: Group } {
    return {
      user: { ...user, groups: [...user.groups, group.id] },
      group: { ...group, userIds: [...group.userIds, user.id] },
    };
  }

  private userFetchCheck(user: User, userIds: string[]): Observable<User[]> {
    const users = userIds.filter((id) => user.id !== id);
    return users.length > 0
      ? forkJoin(users.map((id) => this.dataProviderService.getUser(id)))
      : of([user]);
  }

  generatePartner() {
    
  }
}
