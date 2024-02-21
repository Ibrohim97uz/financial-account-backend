import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from 'src/expense/entities/expense.entity';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from 'src/expense/entities/expense-category';
import { Income, IncomeSchema } from 'src/income/entities/income.entity';
import {
  IncomeCategory,
  IncomeCategorySchema,
} from 'src/income/entities/income-category';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
      { name: Income.name, schema: IncomeSchema },
      { name: IncomeCategory.name, schema: IncomeCategorySchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
