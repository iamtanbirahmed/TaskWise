import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, isValidObjectId } from "mongoose";
import { TaskStatus } from "../dto/task-status.enum";
import { IsDate, IsNotEmpty } from "class-validator";

export type ListDocument = HydratedDocument<List>;
@Schema()
export class List {
  _id?: string;
  @Prop()
  @IsNotEmpty()
  title: string;
  @Prop()
  description: string;
  @Prop()
  status: TaskStatus;
  @Prop()
  @IsDate()
  createdAt: Date;
  @Prop()
  createdBy: string; // TODO: add annotated validation
  @Prop()
  @IsDate()
  updatedAt: Date;
  @Prop()
  updatedBy: string;
}

export const ListSchema = SchemaFactory.createForClass(List);
