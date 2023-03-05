import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { Destroyable } from '../../Utils/destroyable';
import { User, UserSchema } from './../../Models/user';
import { SnackbarService } from './../../Services/snackbar.service';
import { AuthFunctionality } from 'src/app/Models/auth-functionality';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends Destroyable implements OnInit {
  signInForm: FormGroup;
  user$: Observable<User>;
  authFn$: (user: User) => Observable<any>;
 
  authFunctionality: AuthFunctionality = AuthFunctionality.SignIn;
  errorMessage = '';

  private _header = 'Sign In';
  @Input() set header(value: string | undefined) {
    this._header = value;
    if (value.toLowerCase() === 'sign in' || value == null) {
      this.authFunctionality = AuthFunctionality.SignIn;
      return;
    }

    this.authFunctionality = AuthFunctionality.SignUp;
  };

  get header() {
    return this._header;
  }

  get isSignIn() {
    return this.authFunctionality === AuthFunctionality.SignIn;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private router: Router
    ) {
    super();

    this.signInForm = this.fb.group({
      displayName: ['', [Validators.required, this.whiteSpaceValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get displayName() {
    return this.signInForm.get('displayName')
  }

  ngOnInit(): void {
    this.authFnFactory();
  }

  whiteSpaceValidator: Validators = (control: AbstractControl) => {
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

    this.authFn$(user).pipe(
      catchError(err => {
        if (err.message.includes('email')) {
          this.snackbar.open(this.errorMessage, 'close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000
          });
        }

        return of(null);
      })
    ).subscribe({
      // next: () => this.authFunctionality === AuthFunctionality.SignUp ? this.router.navigate(['/']) : null
    });
  }

  private authFnFactory() {
    if (this.authFunctionality === AuthFunctionality.SignUp) {
      this.authFn$ = (user: User) => this.authService.createUserWithEmailAndPassword$(user);
      this.errorMessage = 'This username is already taken. Please pick another'
    } else {
      this.authFn$ = (user: User) => this.authService.signInWithUsernameAndPassword$(user);
      this.errorMessage = 'This user does not exist';
    }
  }
}
