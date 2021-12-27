import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authService.getToken();
    console.log("In the interceptor, the token is: " + token)
    if (token) {
      let header = "Bearer " + token;
      let reqWithAuth = req.clone({ headers: req.headers.set("Authorization", header) });
      return next.handle(reqWithAuth);
    }

    return next.handle(req);

  }
}
