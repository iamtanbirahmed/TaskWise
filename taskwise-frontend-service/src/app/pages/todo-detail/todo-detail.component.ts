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
  todo: ITodoItem | null = null;
  isSlidePanelOpen = false;
  todoForm!: FormGroup;
  constructor(
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
    this.todoItemsService.getAllTodoItems(this.todoId).subscribe({
      next: (response) => {
        this.todoItems = response.data;
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
      if (this.currentTodoItemId) {
        this.todoItemsService
          .updateTodoItem(this.currentTodoItemId, this.todoForm.value)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.getTodoDetails();
              this.onCloseSlidePanel();
            },
          });
      } else {
        this.todoItemsService.addTodoItem(this.todoForm.value).subscribe({
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
