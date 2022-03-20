import { Component, OnInit } from '@angular/core';
import { Destroyable } from "../../Utils/destroyable";
import { debounceTime, fromEvent } from "rxjs";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends Destroyable implements OnInit {
  columnSize: number;

  constructor(private breakPoints: BreakpointObserver) {
    super();
  }

  ngOnInit(): void {

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
}
