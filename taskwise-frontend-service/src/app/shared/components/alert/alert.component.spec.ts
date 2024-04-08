import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AlertComponent } from "./alert.component";

describe("AlertComponent", () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit closeEvent with true when onCloseAlert() is called", () => {
    spyOn(component.closeEvent, "emit");

    component.onCloseAlert();

    expect(component.closeEvent.emit).toHaveBeenCalledWith(true);
  });
});
