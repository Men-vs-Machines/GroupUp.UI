import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Group } from "../Models/group";
import { catchError, Observable, of } from "rxjs";
import { Destroyable } from "../Utils/destroyable";
import { User } from "../Models/user";

@Injectable({
  providedIn: 'root'
})
export class GroupUpApiService extends Destroyable{
  constructor(private client: HttpClient) {
    super();
  }

  fetchGroups(): Observable<Object> {
    return this.client.get(`${this.constructUri()}/Groups`).pipe(
      catchError(err => {
          console.error(err.error);
          return of(null)
        }
      ));
  }

  getGroup(id: string): Observable<Group> {
    return this.client.get<Group>(`${this.constructUri()}/Groups/${id}`).pipe(
      catchError(err => {
        console.error(err.error);
        return of(null)
      })
    )
  }

  postGroup(group: Group): Observable<Group> {
    return this.client.post<Group>(`${this.constructUri()}/Groups`, group);
  }

  postUser(user: User): Observable<User> {
    return this.client.post<User>(`${this.constructUri()}/Users`, user)
  }

  private constructUri(): string {
    return environment.GroupUpAPI
  }
}
