import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { catchError, debounceTime, fromEvent, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';
import { Destroyable } from '../../Utils/destroyable';
import { User, UserSchema } from './../../Models/user';
import { SnackbarService } from './../../Services/snackbar.service';

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
    private snackbar: SnackbarService
    ) {
    super();

    this.signInForm = this.fb.group({
      displayName: ['', Validators.compose([Validators.required, this.whiteSpaceValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  get displayName() {
    return this.signInForm.get('displayName')
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
    this.authService.createUserWithEmailAndPassword$(user).pipe(
      catchError(err => {
        if (err.message.includes('email')) {
          this.snackbar.open('This username is already taken. Please pick another', 'close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000
          });
        }

        return of(null);
      })
    ).subscribe();
  }
}
