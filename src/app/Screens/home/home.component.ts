import { Component, OnInit } from '@angular/core';
import { Destroyable } from '../../Utils/destroyable';
import { BehaviorSubject, debounceTime, fromEvent, Observable } from 'rxjs';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GroupUpApiService } from '../../Services/group-up-api.service';
import { AuthService } from 'src/app/Services/auth.service';
import firebase from 'firebase/compat';
import firebaseUser = firebase.User;
import { User, UserSchema } from './../../Models/user';
import { UserService } from 'src/app/Services/user.service';
import { Firestore } from '@angular/fire/firestore';
import { DuplicateUsernameValidator } from './../../Utils/validators/sign-up-validator';
import { DataProviderService } from './../../Services/data-provider.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends Destroyable implements OnInit {
  columnSize: number;
  signInForm: FormGroup;
  user$: Observable<User>;

  constructor(
    private breakPoints: BreakpointObserver,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private dataProvider: DataProviderService
    ) {
    super();

    this.signInForm = this.fb.group({
      displayName: ['', Validators.compose([Validators.required, this.whiteSpaceValidator, DuplicateUsernameValidator.username(dataProvider, this.user$)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe((evt: any) => {
        console.log(evt.target.innerWidth);
        // this.mediaBreakpoint$.next(evt.target.innerWidth);
      });

    this.user$ = this.userService.user$;

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

  whiteSpaceValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control || !control.value) {
      return null;
    }
    
    const regex = new RegExp(/\s/g);
    if (regex.test(control.value)) {
      return { whitespace: true };
    }

    return null;
  }


  public async onSubmit(form: FormGroup) {
    if (!UserSchema.safeParse(form.value).success || !form.valid) {
      console.log('Invalid user');
      return;
    }
    
    const user: User = UserSchema.parse(form.value);
    this.authService.createUserWithEmailAndPassword$(user).subscribe();
  }
}
