import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../Services/auth.service';
import { Observable, takeUntil, map, filter, mergeMap, shareReplay, forkJoin, tap } from 'rxjs';
import { Destroyable } from 'src/app/Utils/destroyable';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { Group } from 'src/app/Models/group';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent extends Destroyable implements OnInit {
  groups$: Observable<Group[]>;
  
  constructor(private authService: AuthService, private dataProvider: DataProviderService, private userService: UserService) {
    super();
   }

  ngOnInit(): void {
    this.groups$ = this.userService.user$
      .pipe(
        filter(user => !!user?.groups),
        map(user => Array.from(user.groups)),
        tap(data => console.log(data)),
        mergeMap(groups => forkJoin(groups.map(group => this.dataProvider.getGroup(group))))
      )
  }
}
