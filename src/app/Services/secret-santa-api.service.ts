import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CurrentUser} from "../Models/currentuser";

@Injectable({
  providedIn: 'root'
})
export class SecretSantaApiService {
  constructor(private client: HttpClient) { }

  async fetchGroup() {
    const result = await this.client.get(`${environment.secretSantaAPI}/Users`).subscribe(x => console.log(x))
    return result;
  }

  async postUser(user: CurrentUser) {
    const result = await this.client.post(`${environment.secretSantaAPI}/Users`, user)
    return result;
  }
}
