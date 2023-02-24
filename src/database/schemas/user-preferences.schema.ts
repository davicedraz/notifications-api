import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class UserPreferences extends Document {
  @Prop()
  channel: string;

  @Prop()
  enabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserPreferences);