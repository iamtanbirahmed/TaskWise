import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoComponent } from "./todo.component";
import { TodoService } from "../../core/services/todo.service";
import { of } from "rxjs";
import { IResponse, ITodo } from "../../core/models/todo.model";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

describe("TodoComponent", () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let mockTodoService: TodoService;
  let formBuilder: FormBuilder;
  const mockTodoResponse: IResponse<ITodo[]> = {
    data: [
      {
        _id: "123",
        title: "Hello",
        description: "Hello",
        status: "DONE",
      },
    ],
    message: "Mock data",
  };
  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj<TodoService>("TodoService", {
      getAllTodo: of(mockTodoResponse),
      getTodoDetails: undefined,
      addTodo: of({
        data: mockTodoResponse.data[0],
        message: "Created",
      }),
      updateTodo: of({
        data: mockTodoResponse.data[0],
        message: "Updated",
      }),
      deleteTodo: of({
        data: mockTodoResponse.data[0],
        message: "Deleted",
      }),
    });

    await TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.todoForm = formBuilder.group({
      title: new FormControl(
        {
          value: ["mock"],
          disabled: false,
        },
        Validators.required
      ),
      description: new FormControl(
        {
          value: ["mock"],
          disabled: false,
        },
        Validators.required
      ),
      status: new FormControl(
        {
          value: "OPEN",
          disabled: false,
        },
        Validators.required
      ),
    });
    fixture.detectChanges();
  });

  describe("When TodoComponent is initialized", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should call getAllTodo method of todoService and set todos property with response data", () => {
      component.getAllTodos();

      expect(mockTodoService.getAllTodo).toHaveBeenCalledWith(
        component.filterByStatus
      );
      expect(component.todos).toEqual(mockTodoResponse.data);
    });
  });

  describe("When isSidePanel is toggled", () => {
    it("should set isSlidePanelOpen to true when openSlidePanel is called", () => {
      expect(component.isSlidePanelOpen).toBeFalse();
      component.openSlidePanel();
      expect(component.isSlidePanelOpen).toBeTrue();
    });

    it("should set isSlidePanelOpen to false when onCloseSlidePanel is called", () => {
      component.isSlidePanelOpen = true;
      component.onCloseSlidePanel();
      expect(component.isSlidePanelOpen).toBeFalse();
    });
  });

  describe("When deleteTodo() is called", () => {
    it("should call todoService.deleteTodo with correct parameter and call getAllTodos after successful deletion", () => {
      const mockResponse: IResponse<ITodo> = {
        data: mockTodoResponse.data[0],
        message: "Deleted",
      };
      spyOn(component, "getAllTodos");
      component.onDelete(mockResponse.data);
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(
        mockResponse.data._id
      );
      expect(component.getAllTodos).toHaveBeenCalled();
    });
  });

  describe("When onLoadTodoForm() is called", () => {
    it("should load todo form with correct values and open slide panel", () => {
      const mockTodo: ITodo = mockTodoResponse.data[0];
      component.onLoadTodoForm(mockTodo);
      expect(component.todoId).toEqual(mockTodo._id!);
      expect(component.todoForm.value).toEqual({
        title: mockTodo.title,
        description: mockTodo.description,
        status: mockTodo.status,
      });
      expect(component.isSlidePanelOpen).toBeTrue();
    });
  });

  describe("when onSubmit() is called", () => {
    it("should call todoService.updateTodo when form is valid and todoId is present", () => {
      component.todoId = "1";
      spyOn(component, "getAllTodos");
      spyOn(component, "onCloseSlidePanel");
      component.onSubmit();
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith(
        component.todoId,
        component.todoForm.value
      );
      expect(component.getAllTodos).toHaveBeenCalled();
      expect(component.onCloseSlidePanel).toHaveBeenCalled();
    });

    it("should call todoService.addTodo when form is valid and todoId is not present", () => {
      component.todoId = null;
      spyOn(component, "getAllTodos");
      spyOn(component, "onCloseSlidePanel");
      component.onSubmit();
      expect(mockTodoService.addTodo).toHaveBeenCalledWith(
        component.todoForm.value
      );
      expect(component.getAllTodos).toHaveBeenCalled();
      expect(component.onCloseSlidePanel).toHaveBeenCalled();
    });

    it("should mark all form controls as touched when form is invalid", () => {
      component.todoForm.setErrors({ invalid: true });
      component.onSubmit();
      expect(component.todoForm.touched).toBeTrue();
    });
  });
});
