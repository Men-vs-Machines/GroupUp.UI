import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AngularFireModule} from "@angular/fire/compat";
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule
} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {AuthInterceptor} from "./Security/auth-interceptor";
import {AuthGuard} from "./Security/auth-guard";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
