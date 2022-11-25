import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupUpApiService } from '../../Services/group-up-api.service';
import { Destroyable } from '../../Utils/destroyable';
import { filter, map, Observable, shareReplay, Subject, takeUntil, tap, mergeMap, switchMap, forkJoin, combineLatest, of } from 'rxjs';
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
  group$ = new Observable<Group>();
  users$: Observable<User[]>;
  
  constructor(
    private _activatedRoute: ActivatedRoute,
    private dataProviderService: DataProviderService,
    protected override angularFireAuth: AngularFireAuth,
    protected override router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    super(router, angularFireAuth);
  }

  ngOnInit(): void {
    const groupId = this._activatedRoute.snapshot.params['id'];

    this.group$ = this.dataProviderService.getGroup(groupId).pipe(shareReplay(1));
    this.users$ = combineLatest([this.userService.user$, this.group$]).pipe(
      mergeMap(([user, {userIds}]) => this.userFetchCheck(user, userIds)),
    );
  }

  private userFetchCheck(user: User, userIds: string[]) {
    const users = userIds.filter(id => user.id !== id);
    return users.length > 0 ? forkJoin(users.map(id => this.dataProviderService.getUser(id))) : of([user]);   
  }
}
