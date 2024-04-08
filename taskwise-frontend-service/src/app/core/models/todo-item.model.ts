export interface ITodoItem {
  _id?: string;
  title: string;
  listId: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
