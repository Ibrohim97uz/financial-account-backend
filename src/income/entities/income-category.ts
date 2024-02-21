import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class IncomeCategory extends Document {
  @Prop({ ref: 'User', required: true })
  userId: Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const IncomeCategorySchema =
  SchemaFactory.createForClass(IncomeCategory);
