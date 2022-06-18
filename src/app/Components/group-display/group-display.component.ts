import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupUpApiService } from '../../Services/group-up-api.service';
import { Destroyable } from '../../Utils/destroyable';
import { filter, takeUntil } from 'rxjs';
import { Group } from '../../Models/group';
import { Utility } from 'src/app/Utils/utility';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-group-display',
  templateUrl: './group-display.component.html',
  styleUrls: ['./group-display.component.scss'],
})
export class GroupDisplayComponent extends Utility implements OnInit {
  currentGroup: Group;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _groupUpApiService: GroupUpApiService,
    protected override auth: AuthService,
    protected override router: Router
  ) {
    super(router, auth);
  }

  ngOnInit(): void {
    const groupId = this._activatedRoute.snapshot.params['id'];

    this._groupUpApiService
      .getGroup(groupId)
      .pipe(
        filter((group) => !!group),
        takeUntil(this.destroy$)
      )
      .subscribe((x) => {
        console.log(x);
        return (this.currentGroup = x);
      });
  }
}
