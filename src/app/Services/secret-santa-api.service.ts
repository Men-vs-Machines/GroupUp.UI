import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SecretSantaApiService {
  constructor(private client: HttpClient) { }

  async fetchGroup() {
    return this.client.get(`${environment.GroupUpAPI}/Groups`).subscribe(x => console.log(x));
  }

  async postGroup(group: any) {
    // return this.client.post()
  }

}
