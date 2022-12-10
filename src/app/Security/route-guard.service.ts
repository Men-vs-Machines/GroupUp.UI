import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, lastValueFrom, Observable, of, take, takeUntil, tap } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { Destroyable } from '../Utils/destroyable';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService extends Destroyable implements CanActivate { 
  signedIn: boolean;

  constructor(private authService: AuthService, private router: Router, private auth: AngularFireAuth) {
    super();
  }

  async canActivate() {
    const user = await lastValueFrom(this.authService.isLoggedIn());
    const isLoggedIn = !!user;
    if (!isLoggedIn) {
      this.router.navigate(['index']);
    }
    return isLoggedIn;
  }
}
