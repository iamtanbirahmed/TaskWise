import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoItemCardComponent } from "./todo-item-card.component";
import { ITodoItem } from "../../../core/models/todo-item.model";

describe("TodoItemCardComponent", () => {
  let component: TodoItemCardComponent;
  let fixture: ComponentFixture<TodoItemCardComponent>;
  const mockTodoItem: ITodoItem = {
    _id: "123",
    title: "Test Title",
    listId: "66115c508b598e2826e56595",
    description: "Test Description",
    createdAt: new Date("2024-04-05"),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemCardComponent);
    component = fixture.componentInstance;
    component.item = mockTodoItem;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("When EditItem button Clicke", () => {
    it("should emit editItemClicked event with the provided item", () => {
      spyOn(component.editItemClicked, "emit");
      component.onClickEdit(mockTodoItem);
      expect(component.editItemClicked.emit).toHaveBeenCalledWith(mockTodoItem);
    });
  });

  describe("When DeleteItem button Clicke", () => {
    it("should emit deleteItemClicked event with the provided item", () => {
      spyOn(component.deleteItemClicked, "emit");
      component.onClickDelete(mockTodoItem);
      expect(component.deleteItemClicked.emit).toHaveBeenCalledWith(
        mockTodoItem
      );
    });
  });
});
