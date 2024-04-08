import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { TodoCardComponent } from "./todo-card.component";
import { provideRouter, Router } from "@angular/router";
import { TodoDetailComponent } from "../../../pages/todo-detail/todo-detail.component";
import { ITodo } from "../../../core/models/todo.model";
import { TodoComponent } from "../../../pages/todo/todo.component";
import {
  RouterTestingHarness,
  RouterTestingModule,
} from "@angular/router/testing";
import { MasterComponent } from "../../layouts/master/master.component";

describe("TodoCardComponent", () => {
  let component: TodoCardComponent;
  let fixture: ComponentFixture<TodoCardComponent>;
  let router: Router;

  const mockTodo: ITodo = {
    _id: "66115c508b598e2826e56595",
    title: "Test Todo",
    createdAt: new Date("2024-04-05"),
    description: "Test Todo",
    status: "DONE",
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoCardComponent, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoCardComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.todo = mockTodo;
    fixture.detectChanges();
  });
  describe("When component is initialized", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });
  });

  describe("When Edit button Clicked", () => {
    it("should emit editItemClicked event with the provided item", () => {
      spyOn(component.clickEditEvent, "emit");
      component.onClickEdit(mockTodo);
      expect(component.clickEditEvent.emit).toHaveBeenCalledWith(mockTodo);
    });
  });

  describe("When DeleteItem button Clicked", () => {
    it("should emit deleteItemClicked event with the provided item", () => {
      spyOn(component.clickDeleteEvent, "emit");
      component.onClickDelete(mockTodo);
      expect(component.clickDeleteEvent.emit).toHaveBeenCalledWith(mockTodo);
    });
  });

  describe("When Details button Clicked", () => {
    it("should navigate to details page with proper id", fakeAsync(async () => {
      const navigateSpy = spyOn(router, "navigate");
      component.onClickDetail(mockTodo);
      expect(navigateSpy).toHaveBeenCalledWith(["/detail", mockTodo._id]); // E
    }));
  });
});
