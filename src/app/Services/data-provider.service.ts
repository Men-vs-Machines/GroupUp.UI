import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Group } from '../Models/group';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  constructor(private httpClient: HttpClient) { }

  public createGroup(group: Group): Observable<Group> {
    return this.httpClient.post(`${environment.groupUpBff}/groups`, group);
  }
}
