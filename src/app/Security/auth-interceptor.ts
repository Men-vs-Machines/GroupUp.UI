import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../Services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  token!: string;

  constructor(private auth: AuthService) {
    this.auth.token$.subscribe(token => this.token = token);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.token}`)
    });

    return next.handle(authReq);
  }
}
