import {Component} from '@angular/core';
import {AuthService} from "./Services/auth.service";
import {CurrentUser} from "./Models/currentuser";
import {Subscription} from "rxjs";
import {SecretSantaApiService} from "./Services/secret-santa-api.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SecretSanta.UI';
  currentUser: CurrentUser = new CurrentUser();
  $authSubscription: Subscription;

  loginForm = this.formBuilder.group({
    Username: '',
    Password: ''
  });

  constructor(private auth: AuthService, private api: SecretSantaApiService, private formBuilder: FormBuilder) {
    this.$authSubscription = this.auth.user$.subscribe(user => {
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
    if (!this.loginForm.valid) {
      console.error("This is invalid sorry")
      return;
    }

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
