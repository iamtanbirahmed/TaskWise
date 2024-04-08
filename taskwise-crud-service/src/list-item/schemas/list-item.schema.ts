import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

export type ListItemDocument = HydratedDocument<ListItem>;
@Schema()
export class ListItem {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  listId: string;
  @Prop()
  description: string;
  @Prop()
  createdAt: Date;
  @Prop()
  createdBy: string;
  @Prop()
  updatedAt: Date;
  @Prop()
  updatedBy: string;
}

export const ListItemSchema = SchemaFactory.createForClass(ListItem);
