import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SecretSantaApiService {
  constructor(private client: HttpClient) { }

  async fetchGroup() {
    const result = await this.client.get(`${environment.secretSantaAPI}/Groups`).subscribe(x => console.log(x))
    return result;
  }

}
