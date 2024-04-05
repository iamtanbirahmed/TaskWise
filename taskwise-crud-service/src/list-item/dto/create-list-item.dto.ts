import { IsNotEmpty } from "class-validator";

export class CreateListItemDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  listId: string;
}
