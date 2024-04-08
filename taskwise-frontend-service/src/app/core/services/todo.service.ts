import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IResponse, ITodo } from "../models/todo.model";
import { HttpClient } from "@angular/common/http";
import { apiEndpoint } from "../constants/constants";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  constructor(private http: HttpClient) {}

  getAllTodo(status: string): Observable<IResponse<ITodo[]>> {
    let queryString = "";
    if (status !== "") {
      queryString = `status=${status}`;
    }
    return this.http.get<IResponse<ITodo[]>>(
      `${apiEndpoint.TodoEndpoint.getAllTodo}?${queryString}`
    );
  }

  getTodoDetails(todoId: string | null) {
    return this.http.get<IResponse<any>>(
      `${apiEndpoint.TodoEndpoint.getTodoDetails}/${todoId}`
    );
  }

  addTodo(data: ITodo): Observable<IResponse<ITodo>> {
    return this.http.post<IResponse<ITodo>>(
      `${apiEndpoint.TodoEndpoint.addTodo}`,
      data
    );
  }

  updateTodo(id: string, data: ITodo): Observable<IResponse<ITodo>> {
    return this.http.patch<IResponse<ITodo>>(
      `${apiEndpoint.TodoEndpoint.updateTodo}/${id}`,
      data
    );
  }

  deleteTodo(id: string | undefined): Observable<IResponse<ITodo>> {
    return this.http.delete<IResponse<ITodo>>(
      `${apiEndpoint.TodoEndpoint.deleteTodo}/${id}`
    );
  }
}
