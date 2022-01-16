import {Component} from '@angular/core';
import {AuthService} from "./Services/auth.service";
import {CurrentUser} from "./Models/currentuser";
import {takeUntil} from "rxjs";
import {SecretSantaApiService} from "./Services/secret-santa-api.service";
import {FormBuilder} from "@angular/forms";
import {Destroyable} from "./Utils/destroyable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends Destroyable {
  title = 'SecretSanta.UI';
  currentUser: CurrentUser = new CurrentUser();

  loginForm = this.formBuilder.group({
    Username: '',
    Password: ''
  });

  constructor(private auth: AuthService, private api: SecretSantaApiService, private formBuilder: FormBuilder) {
    super();
    this.auth.user$
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(
        user => {
          console.log(`Inside the AppComponent - The user is: ${user.displayName}`)
          this.currentUser = user
        })
  }

  fetchGroups() {
    return this.api.fetchGroup();
  }

  async signIn(token: string) {
    // const result = await this.auth.signIn(token)
  }

  async handleSubmit() {
    // this.auth.signIn(this.loginForm);
    const result = await this.auth.signInAnonymousUser()
    console.log(result)
  }

  getAllUsers() {
    return this.auth.getAllUsers();
  }

  signOut() {
    this.auth.SignOutUser()
  }

}
