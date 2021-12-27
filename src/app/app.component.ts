import { Component } from '@angular/core';
import {AuthService} from "./Services/auth.service";
import {CurrentUser} from "./Models/currentuser";
import {Subscription} from "rxjs";
import firebase from "firebase/compat";
import {SecretSantaApiService} from "./Services/secret-santa-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SecretSanta.UI';
  currentUser: CurrentUser = new CurrentUser();
  $authSubscription: Subscription;

  constructor(private auth: AuthService, private api: SecretSantaApiService) {
    this.$authSubscription = this.auth.user$.subscribe(user => {
      console.log(`Inside the AppComponent - The user is: ${user.displayName}`)
      this.currentUser = user
    })
  }

  fetchGroups() {
    return this.api.fetchGroup();
  }

}
