import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../Services/auth.service";
import { SecretSantaApiService } from "../../Services/secret-santa-api.service";
import { FormBuilder, Validators } from "@angular/forms";
import { CurrentUser } from "../../Models/currentuser";
import { Destroyable } from "../../Utils/destroyable";
import { BehaviorSubject, debounceTime, fromEvent, takeUntil } from "rxjs";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends Destroyable implements OnInit {
  title = 'GroupUp.UI';
  currentUser: CurrentUser = new CurrentUser();
  signedIn = false;
  columnSize: number;

  loginForm = this.formBuilder.group({
    Username: [null, [Validators.required]],
  });

  constructor( private auth: AuthService, private api: SecretSantaApiService, private formBuilder: FormBuilder,
               private breakPoints: BreakpointObserver ) {
    super();
  }

  ngOnInit(): void {
    this.auth.user$
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(user => this.currentUser = user);

    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe((evt: any) => {
        console.log(evt.target.innerWidth);
        // this.mediaBreakpoint$.next(evt.target.innerWidth);
      });

    this.breakPoints.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(( state: BreakpointState ) => {
      if (state.breakpoints[Breakpoints.XSmall]) {
        console.log(state)
        this.columnSize = 1;
      }
      if (state.breakpoints[Breakpoints.Small]) {
        console.log(state)
        this.columnSize = 1;
      }
      if (state.breakpoints[Breakpoints.Medium]) {
        console.log(state)
        this.columnSize = 2;
      }
      if (state.breakpoints[Breakpoints.Large]) {
        console.log(state)
        this.columnSize = 2;
      }
      if (state.breakpoints[Breakpoints.XLarge]) {
        console.log(state)
        this.columnSize = 3;
      }
    });
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
