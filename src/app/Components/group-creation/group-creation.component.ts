import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss']
})
export class GroupCreationComponent {
  groupForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.groupForm = this.fb.group({
      GroupName: '',
      Users: this.fb.array([]),
    });
  }

  Users(): FormArray {
    return this.groupForm.get("Users") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      username: ''
    })
  }

  addQuantity() {
    this.Users().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.Users().removeAt(i);
  }

  onSubmit() {
    console.log(this.groupForm.value);
  }
}
