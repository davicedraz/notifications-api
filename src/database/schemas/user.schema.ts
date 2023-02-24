import { UserPreferences } from "./user-preferences.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, immutable: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, immutable: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({type: JSON})
  webPushSubscription: Object;

  @Prop()
  preferences: UserPreferences[]
}

export const UserSchema = SchemaFactory.createForClass(User);
