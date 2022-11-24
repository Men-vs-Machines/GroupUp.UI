import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../Services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/Models/user';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  
  get user$(): Observable<User> {
    return this.authService.user$;
  }
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

}
