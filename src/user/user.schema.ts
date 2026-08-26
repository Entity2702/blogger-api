import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
 
 @Prop({
  type: String,
  default: () => randomUUID()
 })
 _id!: string;

 @Prop()
 email!: string;

 @Prop()
 password!: string;

}

export const UserSchema = SchemaFactory.createForClass(User);