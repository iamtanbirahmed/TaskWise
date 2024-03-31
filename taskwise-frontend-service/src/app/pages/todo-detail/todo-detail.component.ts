import { Component } from "@angular/core";
import { TodoItemService } from "../../core/services/todo-item.service";
import { ITodoItem } from "../../core/models/todo-item.model";
import { ActivatedRoute } from "@angular/router";
import { TodoItemCardComponent } from "../../shared/components/todo-item-card/todo-item-card.component";
import { SlidePanelComponent } from "../../shared/ui/slide-panel/slide-panel.component";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { TodoService } from "../../core/services/todo.service";
import { ITodo } from "../../core/models/todo.model";

@Component({
  selector: "app-todo-detail",
  standalone: true,
  templateUrl: "./todo-detail.component.html",
  styleUrl: "./todo-detail.component.scss",
  imports: [TodoItemCardComponent, SlidePanelComponent, ReactiveFormsModule],
})
export class TodoDetailComponent {
  todoId: string | null = null;
  currentTodoItemId: string | null = null;
  todoItems: ITodoItem[] = [];
  todoItem: ITodoItem | null = null;
  todo: ITodo | null = null;
  isSlidePanelOpen = false;
  todoForm!: FormGroup;
  constructor(
    private todoService: TodoService,
    private todoItemsService: TodoItemService,
    private router: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.todoForm = this.fb.group({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.todoId = this.router.snapshot.paramMap.get("id");
    this.getTodoDetails();
  }

  getTodoDetails() {
    this.todoService.getTodoDetails(this.todoId).subscribe({
      next: (response) => {
        const data = response.data;
        this.todo = {
          _id: data["_id"],
          title: data["title"],
          description: data["description"],
          status: data["status"],
        };
        console.log(response.data);
        this.todoItems = response.data["items"];
      },
    });
  }

  openSlidePanel() {
    this.isSlidePanelOpen = true;
  }

  onCloseSlidePanel() {
    this.isSlidePanelOpen = false;
  }

  onLoadTodoForm(item: ITodoItem) {
    console.log(item);
    this.currentTodoItemId = item._id!!;
    this.todoForm.patchValue({
      title: item.title,
      description: item.description,
      // status: item.status,
    });
    this.openSlidePanel();
  }

  onSubmit() {
    if (this.todoForm.valid) {
      // checking if this an edit or create request
      const submitData: ITodoItem = {
        title: this.todoForm.value.title,
        description: this.todoForm.value.description,
        listId: this.todoId!!,
      };
      if (this.currentTodoItemId) {
        this.todoItemsService
          .updateTodoItem(this.currentTodoItemId, submitData)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.getTodoDetails();
              this.onCloseSlidePanel();
            },
          });
      } else {
        this.todoItemsService.addTodoItem(submitData).subscribe({
          next: (response) => {
            console.log(response);
            this.getTodoDetails();
            this.onCloseSlidePanel();
          },
        });
      }
    } else {
      this.todoForm.markAllAsTouched();
    }
  }
}
