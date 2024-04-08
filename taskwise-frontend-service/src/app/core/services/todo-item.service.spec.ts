import { TestBed } from "@angular/core/testing";

import { TodoItemService } from "./todo-item.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { apiEndpoint } from "../constants/constants";
import { ITodoItem } from "../models/todo-item.model";
import { IResponse } from "../models/todo.model";

describe("TodoItemService", () => {
  let todoItemService: TodoItemService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoItemService],
    });
    todoItemService = TestBed.inject(TodoItemService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(todoItemService).toBeTruthy();
  });

  it("should add a new todo item", () => {
    const testData: ITodoItem = {
      title: "New Todo Item",
      description: "This is a new todo item",
      listId: "66115c508b598e2826e56595",
    };

    const mockResponse: IResponse<ITodoItem> = {
      data: testData,
    };

    todoItemService.addTodoItem(testData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${apiEndpoint.TodoItemEndpoint.addTodoItem}`
    );
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(testData);
    req.flush(mockResponse);
  });

  it("should update an existing todo item", () => {
    const todoItemId = "123";
    const testData: ITodoItem = {
      title: "Updated Todo Item",
      description: "This is an updated todo item",
      listId: "66115c508b598e2826e56595",
    };

    const mockResponse: IResponse<ITodoItem> = {
      data: testData,
    };

    todoItemService
      .updateTodoItem(todoItemId, testData)
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpTestingController.expectOne(
      `${apiEndpoint.TodoItemEndpoint.updateTodoItem}/${todoItemId}`
    );
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual(testData);
    req.flush(mockResponse);
  });

  it("should delete a todo item", () => {
    const todoItemId = "123";

    const mockResponse: IResponse<any> = {
      data: null,
    };

    todoItemService.deleteTodoItem(todoItemId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${apiEndpoint.TodoItemEndpoint.deleteTodoItem}/${todoItemId}`
    );
    expect(req.request.method).toBe("DELETE");
    req.flush(mockResponse);
  });
});
