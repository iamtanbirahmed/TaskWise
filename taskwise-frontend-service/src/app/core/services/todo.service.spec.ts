import { TestBed } from "@angular/core/testing";

import { TodoService } from "./todo.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { apiEndpoint } from "../constants/constants";
import { IResponse, ITodo } from "../models/todo.model";

describe("TodoService", () => {
  let todoService: TodoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });
    todoService = TestBed.inject(TodoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(todoService).toBeTruthy();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should fetch todo details by ID", () => {
    const todoId = "123";

    const mockResponse: IResponse<any> = {
      data: {
        id: "123",
        title: "Example Todo",
        description: "Example Description",
      },
    };

    todoService.getTodoDetails(todoId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${apiEndpoint.TodoEndpoint.getTodoDetails}/${todoId}`
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should add a new todo", () => {
    const testData: ITodo = {
      title: "New Todo",
      description: "This is a new todo",
      status: "DONE",
    };

    const mockResponse: IResponse<ITodo> = {
      data: testData,
    };

    todoService.addTodo(testData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${apiEndpoint.TodoEndpoint.addTodo}`
    );
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(testData);
    req.flush(mockResponse);
  });

  it("should update an existing todo", () => {
    const todoId = "123";
    const testData: ITodo = {
      title: "Updated Todo",
      description: "This is an updated todo",
      status: "DONE",
    };

    const mockResponse: IResponse<ITodo> = {
      data: testData,
    };

    todoService.updateTodo(todoId, testData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${apiEndpoint.TodoEndpoint.updateTodo}/${todoId}`
    );
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual(testData);
    req.flush(mockResponse);
  });

  it("should delete a todo", () => {
    const todoId = "123";

    const mockResponse: IResponse<any> = {
      data: null,
    };

    todoService.deleteTodo(todoId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${apiEndpoint.TodoEndpoint.deleteTodo}/${todoId}`
    );
    expect(req.request.method).toBe("DELETE");
    req.flush(mockResponse);
  });
});
