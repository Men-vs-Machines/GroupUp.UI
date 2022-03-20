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
    return this.client.get(`${SecretSantaApiService.constructUri()}/Groups`).subscribe(x => console.log(x));
  }

  async postGroup(group: Group) {
    return this.client.post(`${SecretSantaApiService.constructUri()}/Groups`, group)
      .subscribe(x => console.log(x))
  }

  private static constructUri(): string {
    return environment.GroupUpAPI
  }
}
