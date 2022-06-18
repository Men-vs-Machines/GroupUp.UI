import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "../Services/auth.service";
import { Destroyable } from "./destroyable";

@Injectable()
export abstract class Utility extends Destroyable {
  constructor(protected router: Router, protected auth: AuthService) {
    super();
    
    this.auth.token$
    .pipe(
      map(token => !!token)
    ).subscribe(isSignedIn => {
      console.log(isSignedIn);
      if (!isSignedIn) {
        this.router.navigate(['index'])
      }
    })
  }
}
