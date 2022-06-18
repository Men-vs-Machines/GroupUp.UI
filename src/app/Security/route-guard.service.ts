import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, lastValueFrom, map, Observable, of } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
      var isSignedIn = !!(await firstValueFrom(this.authService.token$));
      console.log(isSignedIn);
      if (!isSignedIn) {
        this.router.navigate(['index']);
        return isSignedIn;
      }

      return isSignedIn;
    }
}
