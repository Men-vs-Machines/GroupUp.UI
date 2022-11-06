import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupUpApiService } from '../../Services/group-up-api.service';
import { AuthService } from '../../Services/auth.service';
import { filter, map, takeUntil, tap } from 'rxjs';
import { Group } from '../../Models/group';
import { User } from '../../Models/user';
import { SnackbarService } from '../../Services/snackbar.service';
import { Router } from '@angular/router';
import { mapUserDto } from '../../Utils/user-dto';
import { Utility } from 'src/app/Utils/utility';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { GroupSchema } from './../../Models/group';

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss'],
})
export class GroupCreationComponent extends Utility implements OnInit {
  groupForm: FormGroup;
  currentGroup: Group;

  constructor(
    private fb: FormBuilder,
    private secretSantaApi: GroupUpApiService,
    protected override auth: AuthService,
    private snackbarService: SnackbarService,
    protected override router: Router,
    private dataProviderService: DataProviderService
  ) {
    super(router, auth);
    
    this.groupForm = this.fb.group({
      name: [null, [Validators.required]],
      users: [null],
    });
  }

  get users(): FormArray {
    return this.groupForm.get('users') as FormArray;
  }

  ngOnInit() {
    this.auth.user$
      .pipe(
        filter((user) => !!user),
        map((user) => mapUserDto(user)),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        this.groupForm.patchValue({
          users: [user],
        });
      });
  }

  newUser(): FormGroup {
    return this.fb.group({
      displayName: '',
    });
  }

  onSubmit(group: FormGroup) {
    if (group.status !== 'VALID') {
      this.snackbarService.open(`Group Creation: ${group.status}`, 'Close', {
        duration: 2500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return;
    }

    const newGroup = this.mapToGroup(group);
    console.log(newGroup);

    this.dataProviderService
      .createGroup(newGroup)
      .pipe(
        filter((id) => !!id),
        tap((x) => console.log('Group Creation: ', x)),
        takeUntil(this.destroy$)
      )
      .subscribe((id) => this.router.navigate(['/group', id]));
  }

  private mapToGroup(group: FormGroup): Group {
    if (!GroupSchema.safeParse(group.value).success) {
      console.error('Group Creation: Invalid Group');
    }

    return GroupSchema.parse(group.value); 
  }
}
