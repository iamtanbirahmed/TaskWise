import { IsNotEmpty } from "class-validator";
import { TaskStatus } from "./task-status.enum";

export class CreateListDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  status: TaskStatus;
}
