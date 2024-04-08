import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ITodo } from "../../../core/models/todo.model";
import { Router } from "@angular/router";

export type ITodoType = "OPEN" | "PROGRESS" | "TESTING" | "DONE";
export const ITodoStatus = ["OPEN", "PROGRESS", "TESTING", "DONE"];

@Component({
  selector: "app-todo-card",
  standalone: true,
  imports: [],
  templateUrl: "./todo-card.component.html",
  styleUrl: "./todo-card.component.scss",
})
export class TodoCardComponent {
  @Input() type: ITodoType = "OPEN";
  @Input() todo!: ITodo;
  @Output() clickEditEvent: EventEmitter<ITodo> = new EventEmitter();
  @Output() clickDeleteEvent: EventEmitter<ITodo> = new EventEmitter();
  createdAt: string = new Date().toDateString(); //  Default is set to today for stop breaking

  constructor(private router: Router) {}

  ngOnInit() {
    // The date format should be handled by the backend
    this.todo.createdAt = this.todo.createdAt
      ? new Date(this.createdAt).toDateString()
      : new Date().toDateString();
  }

  onClickDetail(todo: ITodo) {
    this.router.navigate(["/detail", todo._id]);
  }
  onClickEdit(todo: ITodo) {
    this.clickEditEvent.emit(todo);
  }
  onClickDelete(todo: ITodo) {
    this.clickDeleteEvent.emit(todo);
  }
}
