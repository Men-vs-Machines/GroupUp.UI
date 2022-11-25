import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../Services/auth.service";
import { BehaviorSubject, map, Observable, startWith, take, tap } from "rxjs";
import firebase from "firebase/compat";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SnackbarService } from "../../Services/snackbar.service";
import { User } from 'src/app/Models/user';
import { UserService } from './../../Services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  loginForm = this.formBuilder.group({
    Username: [null, [Validators.required]],
  });

  userPageLink = '/user';

  public user$ = new BehaviorSubject<User>(null);

  constructor( private authService: AuthService, private formBuilder: FormBuilder, private snackbarService: SnackbarService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => this.user$.next(user));
  }

  signOut() {
    this.authService.signOutUser$().pipe(take(1)).subscribe();
  }
}
