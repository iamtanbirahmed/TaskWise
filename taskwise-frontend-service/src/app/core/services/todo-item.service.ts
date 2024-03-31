import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IResponse } from "../models/todo.model";
import { ITodoItem } from "../models/todo-item.model";

@Injectable({
  providedIn: "root",
})
export class TodoItemService {
  constructor() {}

  getAllTodoItems(id: string | null): Observable<IResponse<ITodoItem[]>> {
    console.log("TodoId:" + JSON.stringify(id));

    const allToDoItem$: Observable<IResponse<ITodoItem[]>> = of({
      data: [
        {
          _id: "1",
          title: "Item1",
          description: "Test",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          _id: "2",
          title: "item2",
          description: "Test",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      message: "Success",
    });
    return allToDoItem$;
  }

  addTodoItem(data: ITodoItem): Observable<IResponse<ITodoItem>> {
    console.log("TodoItem:" + JSON.stringify(data));

    const mockResponse: Observable<IResponse<any>> = of({
      data: [],
      message: "Created",
    });
    return mockResponse;
  }

  updateTodoItem(
    id: string,
    data: ITodoItem
  ): Observable<IResponse<ITodoItem>> {
    console.log("TodoItem:" + JSON.stringify(data));
    const mockResponse: Observable<IResponse<any>> = of({
      data: [],
      message: "Updated",
    });
    return mockResponse;
  }
}
