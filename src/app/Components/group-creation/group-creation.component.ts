import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SecretSantaApiService } from "../../Services/secret-santa-api.service";
import { AuthService } from "../../Services/auth.service";
import { filter, takeUntil } from "rxjs";
import { Destroyable } from "../../Utils/destroyable";
import Firebase from "firebase/compat";
import { Group } from "../../Models/group";
import { User } from "../../Models/user";
import { SnackbarService } from "../../Services/snackbar.service";
import FirebaseUser = Firebase.User;

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss']
})
export class GroupCreationComponent extends Destroyable implements OnInit {
  groupForm: FormGroup;
  user: FirebaseUser;

  constructor( private fb: FormBuilder, private secretSantaApi: SecretSantaApiService, private auth: AuthService,
               private snackbarService: SnackbarService ) {

    super();
    this.groupForm = this.fb.group({
      Name: [null, [Validators.required]],
      Users: this.fb.array([]),
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
    return this.groupForm.get('Users') as FormArray;
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

    const newGroup = new Group();
    newGroup.Name = group.value.Name;

    const users = group.value.Users as User[];

    await this.secretSantaApi.postGroup(newGroup);
  }
}
