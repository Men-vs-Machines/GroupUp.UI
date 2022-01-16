import {Component, Injectable, OnDestroy} from "@angular/core";
import {ReplaySubject} from "rxjs";

@Injectable()
export abstract class Destroyable implements OnDestroy{
  protected destroy$ = new ReplaySubject<boolean>(1);

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
