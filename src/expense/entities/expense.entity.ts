import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema()
export class Expense extends Document {
  @Prop({ ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;
  @Prop({ ref: 'Expensecategory', required: true })
  category: mongoose.Types.ObjectId;
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

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
