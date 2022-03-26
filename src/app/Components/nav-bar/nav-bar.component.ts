import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../Services/auth.service";
import { BehaviorSubject, finalize, Observable } from "rxjs";
import firebase from "firebase/compat";
import firebaseUser = firebase.User;
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SnackbarService } from "../../Services/snackbar.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public user$: BehaviorSubject<firebaseUser> = new BehaviorSubject<firebaseUser>(null);

  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  get loading$(): Observable<boolean> {
    return this._loading.asObservable();
  }

  loginForm = this.formBuilder.group({
    Username: [null, [Validators.required]],
  });

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.auth.user$
      .pipe(
        finalize(() => this._loading.next(false))
      )
      .subscribe(x => {
        this._loading.next(true);
        this.user$.next(x);
      })
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
