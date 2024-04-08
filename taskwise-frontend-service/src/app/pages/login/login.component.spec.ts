import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { AuthService } from "../../core/services/auth.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ILogin, ILoginResponse } from "../../core/models/auth.mode";
import { Observable, of, throwError } from "rxjs";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let formBuilder: FormBuilder;

  const mockLoginResponse: ILoginResponse = {
    access_token: "mockToken",
    refresh_token: "mockRefreshToken",
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj("AuthService", ["onLogin"]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.loginForm = formBuilder.group({
      email: new FormControl(
        {
          value: ["mock"],
          disabled: false,
        },
        Validators.required
      ),
      password: new FormControl(
        {
          value: ["mock"],
          disabled: false,
        },
        Validators.required
      ),
    });
    fixture.detectChanges();
  });

  describe("When login component is initialized", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });
  });

  describe("When onSubmit() is called", () => {
    it("should call authService.onLogin if loginForm is valid", () => {
      const validFormData = { email: "testUser", password: "testPassword" };
      authService.onLogin.and.returnValue(of(mockLoginResponse));
      component.loginForm.setValue(validFormData);
      component.onSubmit();
      expect(authService.onLogin).toHaveBeenCalledWith(validFormData);
    });
    it("should not call authService.onLogin if loginForm is invalid", () => {
      component.loginForm.setErrors({});
      authService.onLogin.and.returnValue(of(mockLoginResponse));
      component.onSubmit();
      expect(authService.onLogin).not.toHaveBeenCalled();
    });

    it("should set errorResponse properties if loginForm is invalid", () => {
      const validFormData = {
        email: "wrongusername",
        password: "wrongpassword",
      };
      authService.onLogin.and.returnValue(
        throwError(() => new Error("Unauthorized"))
      );
      component.onSubmit();
      // expect(authService.onLogin).toHaveBeenCalledWith(validFormData);
      expect(component.errorResponse.show).toBeTrue();
      expect(component.errorResponse.color).toBe("red");
    });
  });
});
