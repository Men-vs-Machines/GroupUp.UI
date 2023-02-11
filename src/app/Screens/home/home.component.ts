import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
} from '@angular/forms';
import { catchError, debounceTime, fromEvent, Observable, of } from 'rxjs';
import { UserService } from 'src/app/Services/user.service';
import { Destroyable } from '../../Utils/destroyable';
import { User, UserSchema } from './../../Models/user';

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
    private userService: UserService,
    ) {
    super();
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
}
