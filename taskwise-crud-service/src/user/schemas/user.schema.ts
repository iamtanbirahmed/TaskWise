import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty } from "class-validator";
import { HydratedDocument, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;
  @Prop()
  @IsEmail()
  username: string;
  @Prop()
  @IsNotEmpty()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
