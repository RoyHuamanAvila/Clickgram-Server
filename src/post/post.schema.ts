import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from 'src/user/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  owner: mongoose.ObjectId;

  @Prop()
  description: string;

  @Prop({ type: [String], required: true })
  content: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
