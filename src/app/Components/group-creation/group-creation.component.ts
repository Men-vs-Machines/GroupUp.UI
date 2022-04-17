import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GroupUpApiService } from "../../Services/group-up-api.service";
import { AuthService } from "../../Services/auth.service";
import { filter, map, takeUntil } from "rxjs";
import { Destroyable } from "../../Utils/destroyable";
import { Group } from "../../Models/group";
import { User } from "../../Models/user";
import { SnackbarService } from "../../Services/snackbar.service";
import { Router } from "@angular/router";
import { mapUserDto } from "../../Utils/user-dto";

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss']
})
export class GroupCreationComponent extends Destroyable implements OnInit {
  groupForm: FormGroup;
  currentGroup: Group;

  constructor( private fb: FormBuilder, private secretSantaApi: GroupUpApiService, private auth: AuthService,
               private snackbarService: SnackbarService, private router: Router ) {

    super();
    this.groupForm = this.fb.group({
      name: [null, [Validators.required]],
      users: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.addUser();

    this.auth.user$
      .pipe(
        filter(user => !!user),
        map(user => mapUserDto(user)),
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        this.Users().push(
          this.fb.group({
            displayName: user.displayName,
            hidden: true
          }))
      })
  }

  Users(): FormArray {
    return this.groupForm.get('users') as FormArray;
  }

  newUser(): FormGroup {
    return this.fb.group({
      displayName: ''
    })
  }

  addUser() {
    this.Users().push(this.newUser());
  }

  removeUser( i: number ) {
    this.Users().removeAt(i);
  }

  onSubmit( group: FormGroup ) {
    if (group.status !== 'VALID') {
      this.snackbarService.open(`Group Creation: ${group.status}`, 'Close', {
        duration: 2500,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      })
      return;
    }

    const newGroup = this.mapToGroup(group);

    // Post as new Users
    const users = group.value.users as User[];
    console.log(users);

    // this.secretSantaApi
    //   .postGroup(newGroup)
    //   .pipe(
    //     filter(group => !!group),
    //     map(group => group.id),
    //     takeUntil(this.destroy$))
    //   .subscribe(id => this.router.navigate(['/group', id]));
  }

  private mapToGroup(group) {
    const newGroup = new Group();
    newGroup.name = group.value.name;
    return newGroup;
  }
}
