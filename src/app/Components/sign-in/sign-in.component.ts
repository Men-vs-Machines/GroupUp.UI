import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';
import { Destroyable } from '../../Utils/destroyable';
import { User, UserSchema } from './../../Models/user';
import { SnackbarService } from './../../Services/snackbar.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends Destroyable implements OnInit {
  signInForm: FormGroup;
  user$: Observable<User>;
  authFn$: (user: User) => Observable<any>;
  @Input() header = 'Sign In';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackbar: SnackbarService
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

  private authFnFactory() {
    console.log(this.header.toLowerCase());
    if (this.header.toLowerCase() === 'sign up') {
      this.authFn$ = (user: User) => this.authService.createUserWithEmailAndPassword$(user);
    } else {
      this.authFn$ = (user: User) => this.authService.signInWithUsernameAndPassword$(user);
    }
  }
}
