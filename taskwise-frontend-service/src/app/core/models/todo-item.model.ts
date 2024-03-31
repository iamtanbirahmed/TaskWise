export interface ITodoItem {
  _id?: string;
  title: string;
  listId: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}
