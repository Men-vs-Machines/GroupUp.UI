import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Group } from '../Models/group';
import { Observable, tap } from 'rxjs';
import { User } from 'src/app/Models/user';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  constructor(private httpClient: HttpClient) { }

  public createGroup(group: Group): Observable<string> {
    return this.httpClient.post<string>(`${environment.groupUpBff}/groups`, group);
  }

  public getGroup(groupId: string): Observable<Group> {
    return this.httpClient.get<Group>(`${environment.groupUpBff}/groups/${groupId}`);
  }

  public getUser(userId: string): Observable<User> {
    return this.httpClient.get<Group>(`${environment.groupUpBff}/users/${userId}`);
  }

  public createUser(user: User) {
    return this.httpClient.post(`${environment.groupUpBff}/users`, user);
  }
}
