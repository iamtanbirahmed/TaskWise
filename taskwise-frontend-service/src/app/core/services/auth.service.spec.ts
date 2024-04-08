import { TestBed } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { TokenService } from "./token.service";
import { Observable } from "rxjs";
import { ILogin, ILoginResponse } from "../models/auth.mode";
// Http testing module and mocking controller
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { apiEndpoint } from "../constants/constants";
describe("AuthService", () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: jasmine.createSpyObj("TokenService", [
            "getToken",
            "setToken",
            "removeToken",
          ]),
        },
      ],
    });
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    tokenServiceSpy = TestBed.inject(
      TokenService
    ) as jasmine.SpyObj<TokenService>;
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(authService).toBeTruthy();
    expect(tokenServiceSpy).toBeTruthy();
  });

  it("should send login request and set token on successful response", () => {
    const testData: ILogin = {
      email: "test@example.com",
      password: "password123",
    };

    const mockResponse: ILoginResponse = {
      access_token: "mockAccessToken",
      refresh_token: "mockRefreshToken",
    };

    authService.onLogin(testData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      // expect(tokenService.getToken()).toEqual(mockResponse.access_token); // Assuming getToken() returns the token
    });

    const req = httpTestingController.expectOne(
      `${apiEndpoint.AuthEndpoint.login}`
    );
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({
      username: testData.email,
      password: testData.password,
    });
    req.flush(mockResponse);
  });
});
