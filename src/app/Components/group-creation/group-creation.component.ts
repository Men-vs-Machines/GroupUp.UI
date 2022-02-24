import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss']
})
export class GroupCreationComponent implements OnInit {
  groupForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.groupForm = this.fb.group({
      GroupName: '',
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
      username: ''
    })
  }

  addUser() {
    this.Users().push(this.newUser());
  }

  removeUser(i: number) {
    this.Users().removeAt(i);
  }

  onSubmit() {
    console.log(this.groupForm.value);
  }
}
