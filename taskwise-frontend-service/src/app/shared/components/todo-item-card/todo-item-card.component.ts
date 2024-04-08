import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ITodoItem } from "../../../core/models/todo-item.model";

@Component({
  selector: "app-todo-item-card",
  standalone: true,
  imports: [],
  templateUrl: "./todo-item-card.component.html",
  styleUrl: "./todo-item-card.component.scss",
})
export class TodoItemCardComponent {
  @Input() item!: ITodoItem;
  @Output() editItemClicked: EventEmitter<ITodoItem> = new EventEmitter();
  @Output() deleteItemClicked: EventEmitter<ITodoItem> = new EventEmitter();
  createdAt: string = new Date().toDateString();

  ngOnInit() {
    // The date format should be handled by the backend
    this.createdAt = this.item.createdAt
      ? new Date(this.createdAt).toDateString()
      : new Date().toDateString();
  }

  onClickEdit(item: ITodoItem) {
    this.editItemClicked.emit(item);
  }

  onClickDelete(item: ITodoItem) {
    this.deleteItemClicked.emit(item);
  }
}
