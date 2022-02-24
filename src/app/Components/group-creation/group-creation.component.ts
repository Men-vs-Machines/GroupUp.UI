import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SecretSantaApiService} from "../../Services/secret-santa-api.service";
import {Group} from "../../Models/group";

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss']
})
export class GroupCreationComponent implements OnInit {
  groupForm: FormGroup;

  constructor(private fb: FormBuilder, private secretSantaApi: SecretSantaApiService) {

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
      username: [null, [Validators.required]]
    })
  }

  addUser() {
    this.Users().push(this.newUser());
  }

  removeUser(i: number) {
    this.Users().removeAt(i);
  }

  async onSubmit(group: FormGroup) {
    // console.log(group.value as Group);
    await this.secretSantaApi.postGroup(group.value as Group);
  }
}
