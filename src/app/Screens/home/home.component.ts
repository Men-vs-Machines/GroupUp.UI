import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../Services/auth.service";
import {SecretSantaApiService} from "../../Services/secret-santa-api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {CurrentUser} from "../../Models/currentuser";
import {Destroyable} from "../../Utils/destroyable";
import {takeUntil} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends Destroyable implements OnInit {
  title = 'GroupUp.UI';
  currentUser: CurrentUser = new CurrentUser();
  signedIn = false;

  loginForm = this.formBuilder.group({
    Username: [null, [Validators.required]],
  });


  constructor(private auth: AuthService, private api: SecretSantaApiService, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.auth.user$
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(
        user => this.currentUser = user)

    this.auth.isUserSignedIn
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(signedIn => this.signedIn = signedIn);
  }

  fetchGroups() {
    return this.api.fetchGroup();
  }

  async handleSubmit() {
    if (!this.loginForm.valid) {
      console.error("Invalid")
      return;
    }

    if (!this.signedIn) {
      await Promise.all([this.auth.signInAnonymousUser(), this.auth.setCurrentUserName(this.loginForm.value)])
      return;
    }

    await this.auth.setCurrentUserName(this.loginForm.value);
    console.log(this.currentUser)
  }

  getAllUsers() {
    return this.auth.getAllUsers();
  }

  async signOut() {
    await this.auth.SignOutUser()
  }

}
