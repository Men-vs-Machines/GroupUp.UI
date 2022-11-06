import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../Services/auth.service";
import { BehaviorSubject, map, Observable, startWith } from "rxjs";
import firebase from "firebase/compat";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SnackbarService } from "../../Services/snackbar.service";
import { UserLoadingState } from "../../Models/user-loading-state";
import firebaseUser = firebase.User;
import { User } from 'src/app/Models/user';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  loginForm = this.formBuilder.group({
    Username: [null, [Validators.required]],
  });

  public user$ = new BehaviorSubject<User>(null);

  constructor( private authService: AuthService, private formBuilder: FormBuilder, private snackbarService: SnackbarService ) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => this.user$.next(user));
  }

  async signOut() {
    await this.authService.signOutUser();
  }
}
