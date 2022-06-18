import { Component, OnInit } from '@angular/core';
import { Destroyable } from "../../Utils/destroyable";
import { BehaviorSubject, debounceTime, fromEvent } from "rxjs";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { GroupUpApiService } from "../../Services/group-up-api.service";
import { AuthService } from 'src/app/Services/auth.service';
import firebase from "firebase/compat";
import firebaseUser = firebase.User;
import { User } from '../../Models/user';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends Destroyable implements OnInit {
  columnSize: number;
  signInForm: FormGroup;
  user$: BehaviorSubject<firebaseUser> = new BehaviorSubject<firebaseUser>(null);

  constructor(
    private breakPoints: BreakpointObserver,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private apiService: GroupUpApiService,
    private authService: AuthService
  ) {
    super();

    this.signInForm = this.fb.group({
      displayName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe((evt: any) => {
        console.log(evt.target.innerWidth);
        // this.mediaBreakpoint$.next(evt.target.innerWidth);
      });

      this.authService.user$.subscribe(this.user$);

    this.breakPoints
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints[Breakpoints.XSmall]) {
          console.log(state);
          this.columnSize = 1;
        }
        if (state.breakpoints[Breakpoints.Small]) {
          console.log(state);
          this.columnSize = 1;
        }
        if (state.breakpoints[Breakpoints.Medium]) {
          console.log(state);
          this.columnSize = 2;
        }
        if (state.breakpoints[Breakpoints.Large]) {
          console.log(state);
          this.columnSize = 2;
        }
        if (state.breakpoints[Breakpoints.XLarge]) {
          console.log(state);
          this.columnSize = 3;
        }
      });
  }

  public onSubmit(form: FormGroup) {
    console.log(form.value as User);
    this.apiService.postUser(form.value).subscribe((x) => console.log(x));
  }
}
