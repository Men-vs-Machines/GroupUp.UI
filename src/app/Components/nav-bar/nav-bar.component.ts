import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../Services/auth.service";
import { map, Observable, startWith } from "rxjs";
import firebase from "firebase/compat";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SnackbarService } from "../../Services/snackbar.service";
import { UserLoadingState } from "../../Models/user-loading-state";
import firebaseUser = firebase.User;


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  loginForm = this.formBuilder.group({
    Username: [null, [Validators.required]],
  });

  public dataState$: Observable<UserLoadingState<firebaseUser>>;

  constructor( private auth: AuthService, private formBuilder: FormBuilder, private snackbarService: SnackbarService ) {
  }

  ngOnInit(): void {
   this.dataState$ = this.auth.user$
      .pipe(
        startWith(null),
        map((value) => !!value ? ({needsSignIn: false, isLoading: false, value}) : ({needsSignIn: true, isLoading: false }))
      );
  }

  async handleSubmit( form: FormGroup ) {
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
    await this.auth.setCurrentUserName(username, user);
  }

  async signOut() {
    await this.auth.SignOutUser();
  }
}
