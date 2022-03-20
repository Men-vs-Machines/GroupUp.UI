import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../Services/auth.service";
import {BehaviorSubject} from "rxjs";
import firebase from "firebase/compat";
import firebaseUser = firebase.User;
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SnackbarService } from "../../Services/snackbar.service";
import { fetchPackageManifest } from "@angular/cli/utilities/package-metadata";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  user$: BehaviorSubject<firebaseUser> = new BehaviorSubject<firebaseUser>(null);
  user: firebaseUser;

  loginForm = this.formBuilder.group({
    Username: [null, [Validators.required]],
  });

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => this.user = user)
  }

  async handleSubmit(form: FormGroup) {
    if (!this.loginForm.valid) {
      this.snackbarService.open(`Group Creation: ${this.loginForm.status}`, 'Close', {
        duration: 2500,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      })

      return;
    }

    const username = form.value.Username
    const { user } = await this.auth.signInAnonymousUser();
    await this.auth.setCurrentUserName(username, user)
  }

  async signOut() {
    await this.auth.SignOutUser();
  }
}
