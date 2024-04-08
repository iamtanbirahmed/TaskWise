import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeaderComponent } from "./header.component";
import { AuthService } from "../../../core/services/auth.service";
import { provideRouter, Router } from "@angular/router";
import { TodoComponent } from "../../../pages/todo/todo.component";
import {
  RouterTestingHarness,
  RouterTestingModule,
} from "@angular/router/testing";
import { BehaviorSubject, of } from "rxjs";
import { MasterComponent } from "../master/master.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj("AuthService", ["onLogout"]);
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    // harness = await RouterTestingHarness.create();
    // component = await harness.navigateByUrl("/", MasterComponent);
  });

  describe("When HeaderComponent is initialized", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });
  });

  describe("When logout tab is clicked", () => {
    it("should call onLogout() of authService", () => {
      component.onLogout();
      expect(authService.onLogout).toHaveBeenCalled();
    });
  });

  describe("When todo tab is clicked", () => {
    it('should navigate to "/" route', () => {
      const navigateSpy = spyOn(router, "navigate");
      component.onClickTodo();
      expect(navigateSpy).toHaveBeenCalledWith(["/"]);
    });
  });
});
