import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  surname: string;

  @Prop()
  login: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  birthDate: string;

  @Prop([String])
  profilePicture: string[];

  @Prop({ required: false })
  active: boolean;

  @Prop({ required: false })
  hash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
