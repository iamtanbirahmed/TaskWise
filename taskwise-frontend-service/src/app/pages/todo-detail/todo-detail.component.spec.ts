import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoDetailComponent } from "./todo-detail.component";
import { of } from "rxjs";
import { TodoService } from "../../core/services/todo.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { IResponse, ITodo } from "../../core/models/todo.model";
import { TodoItemService } from "../../core/services/todo-item.service";
import { provideRouter } from "@angular/router";

describe("TodoDetailComponent", () => {
  let component: TodoDetailComponent;
  let mockTodoService: TodoService;
  let mockDotoItemService: TodoItemService;
  let formBuilder: FormBuilder;
  let fixture: ComponentFixture<TodoDetailComponent>;

  const mockTodoResponse: IResponse<ITodo[]> = {
    data: [
      {
        _id: "66115c508b598e2826e56595",
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
      getTodoDetails: of(mockTodoResponse),
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

    mockDotoItemService = jasmine.createSpyObj<TodoItemService>(
      "TodoItemService",
      {
        addTodoItem: undefined,
        updateTodoItem: undefined,
        deleteTodoItem: undefined,
      }
    );

    await TestBed.configureTestingModule({
      imports: [TodoDetailComponent],
      providers: [
        provideRouter([{ path: "**", component: TodoDetailComponent }]),
        { provide: TodoService, useValue: mockTodoService },
        { provide: TodoItemService, useValue: mockDotoItemService },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoDetailComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoDetailComponent);
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
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  // TODO: the functionalities are similar to todo-component
  // unit-test will be added if time permits
});
