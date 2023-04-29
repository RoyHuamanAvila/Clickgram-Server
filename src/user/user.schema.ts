import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  picture: string;

  @Prop({ default: [], type: [SchemaTypes.ObjectId], ref: 'User' })
  follows: User[];

  @Prop({ default: [], type: [SchemaTypes.ObjectId], ref: 'User' })
  followers: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
