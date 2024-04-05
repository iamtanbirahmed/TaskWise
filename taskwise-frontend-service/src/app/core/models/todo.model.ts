import { ITodoType } from "../../shared/components/todo-card/todo-card.component";

export interface IResponse<T> {
  data: T;
  message?: string;
}

export interface ITodo {
  _id?: string;
  title: string;
  description: string;
  status: ITodoType;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
