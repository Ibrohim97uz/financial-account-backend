import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Income extends Document {
  @Prop({ ref: 'User', required: true })
  userId: Types.ObjectId;
  @Prop({ required: true, ref: 'IncomeCategory' })
  category: Types.ObjectId;
  @Prop({ required: true })
  price: string;
  @Prop({ default: Date.now })
  date: Date;
  @Prop()
  comment: string;
  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);
