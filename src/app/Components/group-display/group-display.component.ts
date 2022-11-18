import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupUpApiService } from '../../Services/group-up-api.service';
import { Destroyable } from '../../Utils/destroyable';
import { filter, Subject, takeUntil } from 'rxjs';
import { Group } from '../../Models/group';
import { Utility } from 'src/app/Utils/utility';
import { AuthService } from 'src/app/Services/auth.service';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-group-display',
  templateUrl: './group-display.component.html',
  styleUrls: ['./group-display.component.scss'],
})
export class GroupDisplayComponent extends Utility implements OnInit {

  groupSubject = new Subject<Group>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private dataProviderService: DataProviderService,
    protected override angularFireAuth: AngularFireAuth,
    protected override router: Router
  ) {
    super(router, angularFireAuth);
  }

  ngOnInit(): void {
    const groupId = this._activatedRoute.snapshot.params['id'];

    this.dataProviderService
      .getGroup(groupId)
      .pipe(
        filter((group) => !!group),
        takeUntil(this.destroy$)
      )
      .subscribe(this.groupSubject);
  }
}
