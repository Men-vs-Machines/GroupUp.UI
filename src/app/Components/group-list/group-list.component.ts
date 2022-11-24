import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../Services/auth.service';
import { Observable, takeUntil, map, filter, mergeMap, shareReplay, forkJoin } from 'rxjs';
import { User } from 'src/app/Models/user';
import { Destroyable } from 'src/app/Utils/destroyable';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { Group } from 'src/app/Models/group';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent extends Destroyable implements OnInit {
  
  groups$: Observable<Group[]>;
  
  constructor(private authService: AuthService, private dataProvider: DataProviderService) {
    super();
   }

  ngOnInit(): void {
    this.groups$ = this.authService.user$
      .pipe(
        filter(user => !!user?.groups),
        map(user => user.groups),
        mergeMap(groups => forkJoin(groups.map(group => this.dataProvider.getGroup(group)))),
        takeUntil(this.destroy$)
      )
  }
}
