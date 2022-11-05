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
    protected override router: Router
  ) {
    super(router, auth);
    
    this.groupForm = this.fb.group({
      name: [null, [Validators.required]],
      users: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.addUser();

    this.auth.user$
      .pipe(
        filter((user) => !!user),
        map((user) => mapUserDto(user)),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        console.log(user)
        this.users.push(
          this.fb.group({
            displayName: user.displayName,
            hidden: true,
            id: user.id,
          })
        );
      });
  }

  get users(): FormArray {
    return this.groupForm.get('users') as FormArray;
  }

  newUser(): FormGroup {
    return this.fb.group({
      displayName: '',
    });
  }

  addUser() {
    this.users.push(this.newUser());
  }

  removeUser(i: number) {
    this.users.removeAt(i);
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

    // Post as new Users
    const users = group.value.users as User[];

    this.secretSantaApi
      .postGroup(newGroup)
      .pipe(
        filter((group) => !!group),
        tap((x) => console.log(x)),
        map((group) => group.id),
        takeUntil(this.destroy$)
      )
      .subscribe((id) => this.router.navigate(['/group', id]));
  }

  private mapToGroup(group) {
    const newGroup: Group = {
      name: group.value.name,
      users: group.value.users,
    };
    return newGroup;
  }
}
