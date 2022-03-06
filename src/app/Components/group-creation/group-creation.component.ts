import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SecretSantaApiService } from "../../Services/secret-santa-api.service";
import { Group } from "../../Models/group";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss']
})
export class GroupCreationComponent implements OnInit {
  groupForm: FormGroup;

  constructor(private fb: FormBuilder, private secretSantaApi: SecretSantaApiService,
              private snackBar: MatSnackBar) {

    this.groupForm = this.fb.group({
      Name: [null, [Validators.required]],
      Users: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.addUser();
  }

  Users(): FormArray {
    return this.groupForm.get("Users") as FormArray
  }

  newUser(): FormGroup {
    return this.fb.group({
      DisplayName: [null, [Validators.required]]
    })
  }

  addUser() {
    this.Users().push(this.newUser());
  }

  removeUser(i: number) {
    this.Users().removeAt(i);
  }

  async onSubmit(group: FormGroup) {
    if (group.status !== 'VALID') {
      this.snackBar.open(`Group Creation: ${group.status}`, 'Close', {
        duration: 2500,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return;
    }

    await this.secretSantaApi.postGroup(group.value as Group);
  }
}
