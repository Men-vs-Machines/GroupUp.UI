import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SecretSantaApiService } from "../../Services/secret-santa-api.service";
import { AuthService } from "../../Services/auth.service";
import { filter, switchMap, takeUntil } from "rxjs";
import { Destroyable } from "../../Utils/destroyable";
import Firebase from "firebase/compat";
import { Group } from "../../Models/group";
import { User } from "../../Models/user";
import { SnackbarService } from "../../Services/snackbar.service";
import { Router } from "@angular/router";
import FirebaseUser = Firebase.User;

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss']
})
export class GroupCreationComponent extends Destroyable implements OnInit {
  groupForm: FormGroup;
  user: FirebaseUser;
  currentGroup: Group;

  constructor( private fb: FormBuilder, private secretSantaApi: SecretSantaApiService, private auth: AuthService,
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
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        this.user = user

        this.Users().push(
          this.fb.group({
            displayName: this.user.displayName,
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

  async onSubmit( group: FormGroup ) {
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
    const users = group.value.Users as User[];

    await this.secretSantaApi
      .postGroup(newGroup)
      .pipe(
        filter(group => !!group),
        takeUntil(this.destroy$)
      )
      .subscribe(group => {
        this.currentGroup = group
        console.log(this.currentGroup)
      });

    setTimeout(async() => {
      if (this.currentGroup) {
        console.log(this.currentGroup.id)
        await this.router.navigate(['/group', this.currentGroup.id])
      }
    },1000)

  }

  private mapToGroup( group ) {
    const newGroup = new Group();
    newGroup.name = group.value.Name;
    return newGroup;
  }
}
