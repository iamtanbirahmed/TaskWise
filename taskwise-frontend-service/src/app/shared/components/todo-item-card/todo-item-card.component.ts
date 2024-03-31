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

  onClickEdit(item: ITodoItem) {
    this.editItemClicked.emit(item);
  }
}
