import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { filter, map, takeUntil, tap } from 'rxjs';
import { Group } from '../../Models/group';
import { SnackbarService } from '../../Services/snackbar.service';
import { Router } from '@angular/router';
import { Utility } from 'src/app/Utils/utility';
import { DataProviderService } from 'src/app/Services/data-provider.service';
import { GroupSchema } from './../../Models/group';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/Services/user.service';

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
    private auth: AuthService,
    protected override angularFireAuth: AngularFireAuth,
    private snackbarService: SnackbarService,
    protected override router: Router,
    private dataProviderService: DataProviderService,
    private userService: UserService
  ) {
    super(router, angularFireAuth);

    this.groupForm = this.fb.group({
      name: [null, [Validators.required]],
      userIds: [null],
    });
  }

  get users(): FormArray {
    return this.groupForm.get('users') as FormArray;
  }

  ngOnInit() {
    this.userService.user$
      .pipe(
        filter((user) => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        this.groupForm.patchValue({
          userIds: [user.id],
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

    this.dataProviderService
      .createGroup(newGroup)
      .pipe(
        filter((id) => !!id),
        takeUntil(this.destroy$),
        tap(() => this.userService.fetchUser())
      )
      .subscribe({
        next: (id) => this.router.navigate(['/group', id]),
      });
  }

  private mapToGroup(group: FormGroup): Group {
    if (!GroupSchema.safeParse(group.value).success) {
      console.error('Group Creation: Invalid Group');
    }

    return GroupSchema.parse(group.value);
  }
}
