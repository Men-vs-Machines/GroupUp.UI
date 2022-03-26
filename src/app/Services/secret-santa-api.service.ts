import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Group } from "../Models/group";
import { BehaviorSubject, catchError, Observable, of } from "rxjs";
import { Destroyable } from "../Utils/destroyable";

@Injectable({
  providedIn: 'root'
})
export class SecretSantaApiService extends Destroyable{
  constructor(private client: HttpClient) {
    super();
  }

  fetchGroup(): Observable<Object> {
    return this.client.get(`${SecretSantaApiService.constructUri()}/Groups`).pipe(
      catchError(err => {
          console.error(err.error);
          return of(null)
        }
      ));
  }

  postGroup(group: Group): Observable<Group> {
    return this.client.post<Group>(`${SecretSantaApiService.constructUri()}/Groups`, group);
  }

  private static constructUri(): string {
    return environment.GroupUpAPI
  }
}
