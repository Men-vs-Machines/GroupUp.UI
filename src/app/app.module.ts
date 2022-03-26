import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AngularFireModule } from "@angular/fire/compat";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthInterceptor } from "./Security/auth-interceptor";
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { HomeComponent } from './Screens/home/home.component';
import { GroupCreationComponent } from './Components/group-creation/group-creation.component';
import { MatGridListModule } from "@angular/material/grid-list";
import { PageNotFoundComponent } from './Components/page-not-found/page-not-found.component';
import { MatCardModule } from "@angular/material/card";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GroupDisplayComponent } from './Components/group-display/group-display.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    GroupCreationComponent,
    PageNotFoundComponent,
    GroupDisplayComponent,
  ],
    imports: [
        BrowserModule,
        MatButtonModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        FormsModule,
        MatToolbarModule,
        MatGridListModule,
        MatCardModule,
        MatProgressSpinnerModule,
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
