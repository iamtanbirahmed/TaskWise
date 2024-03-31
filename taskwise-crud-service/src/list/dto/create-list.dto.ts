import { TaskStatus } from "./task-status.enum";

export class CreateListDto {
  title: string;
  description: string;
  status: TaskStatus;
}
