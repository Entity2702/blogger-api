import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import { User } from "../user/user.schema";
import { HydratedDocument } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post{
 @Prop({
  type: String,
  default: () => randomUUID()
 })
 _id!: string

 @Prop()
 title!: string

 @Prop()
 content!: string

 @Prop({
  type: String,
  ref: User.name
 })
 authorId!: string

}

export const PostSchema = SchemaFactory.createForClass(Post);