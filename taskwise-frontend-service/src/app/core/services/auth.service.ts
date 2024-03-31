import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ILogin, ILoginResponse } from "../models/auth.mode";
import { apiEndpoint } from "../constants/constants";
import { map } from "rxjs";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  onLogin(data: ILogin) {
    const loginRequestData = {
      username: data.email,
      password: data.password,
    };

    return this.http
      .post<ILoginResponse>(
        `${apiEndpoint.AuthEndpoint.login}`,
        loginRequestData,
        {
          headers: { "Content-Type": "application/json" }, //Content-Type: application/x-www-form-urlencoded
        }
      )
      .pipe(
        map((response) => {
          console.log(response);
          if (response) {
            this.tokenService.setToken(response.access_token);
          }
          return response;
        })
      );
  }

  onLogout() {
    this.tokenService.removeToken();
    this.http.post(`${apiEndpoint.AuthEndpoint.logout}`, "").subscribe({
      next: (response) => {
        console.error(response);
      },
    });
  }
}
