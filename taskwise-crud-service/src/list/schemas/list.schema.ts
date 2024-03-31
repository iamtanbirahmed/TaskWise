import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { TaskStatus } from "../dto/task-status.enum";

export type ListDocument = HydratedDocument<List>;
@Schema()
export class List {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  status: TaskStatus;
  @Prop()
  createAt: Date;
  @Prop()
  createdBy: string;
  @Prop()
  updateAt: Date;
  @Prop()
  updatedBy: string;
}

export const ListSchema = SchemaFactory.createForClass(List);
