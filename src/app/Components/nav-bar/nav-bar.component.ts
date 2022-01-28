import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../Services/auth.service";
import {BehaviorSubject} from "rxjs";
import firebase from "firebase/compat";
import User = firebase.User;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(this.user$)
  }

}
