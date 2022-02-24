import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Group} from "../Models/group";

@Injectable({
  providedIn: 'root'
})
export class SecretSantaApiService {
  constructor(private client: HttpClient) {
  }

  async fetchGroup() {
    return this.client.get(`${environment.GroupUpAPI}/Groups`).subscribe(x => console.log(x));
  }

  async postGroup(group: Group) {
    console.log(group);
    return this.client.post(`${environment.GroupUpAPI}/Groups`, group)
      .subscribe(x => console.log(x))
  }
}
