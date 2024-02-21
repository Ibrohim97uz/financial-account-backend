import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Income, IncomeSchema } from './entities/income.entity';
import {
  IncomeCategory,
  IncomeCategorySchema,
} from './entities/income-category';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Income.name, schema: IncomeSchema },
      { name: IncomeCategory.name, schema: IncomeCategorySchema },
    ]),
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
