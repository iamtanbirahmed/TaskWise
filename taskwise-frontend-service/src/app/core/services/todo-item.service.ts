import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IResponse } from "../models/todo.model";
import { ITodoItem } from "../models/todo-item.model";
import { HttpClient } from "@angular/common/http";
import { apiEndpoint } from "../constants/constants";

@Injectable({
  providedIn: "root",
})
export class TodoItemService {
  constructor(private http: HttpClient) {}

  getAllTodoItems(id: string | null): Observable<IResponse<ITodoItem[]>> {
    console.log("TodoId:" + JSON.stringify(id));

    const allToDoItem$: Observable<IResponse<ITodoItem[]>> = of({
      data: [
        {
          _id: "1",
          title: "Item1",
          listId: "",
          description: "Test",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          _id: "2",
          title: "item2",
          listId: "",
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
    return this.http.post<IResponse<ITodoItem>>(
      `${apiEndpoint.TodoItemEndpoint.addTodoItem}`,
      data
    );
  }

  updateTodoItem(
    id: string,
    data: ITodoItem
  ): Observable<IResponse<ITodoItem>> {
    return this.http.patch<IResponse<ITodoItem>>(
      `${apiEndpoint.TodoItemEndpoint.updateTodoItem}/${id}`,
      data
    );
  }

  deleteTodoItem(id: string | undefined): Observable<IResponse<ITodoItem>> {
    return this.http.delete<IResponse<ITodoItem>>(
      `${apiEndpoint.TodoItemEndpoint.deleteTodoItem}/${id}`
    );
  }
}
