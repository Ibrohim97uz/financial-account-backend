import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ExpenseCategory } from 'src/expense/entities/expense-category';
import { Expense } from 'src/expense/entities/expense.entity';
import { IncomeCategory } from 'src/income/entities/income-category';
import { Income } from 'src/income/entities/income.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Expense.name) readonly expenseModel: Model<Expense>,
    @InjectModel(ExpenseCategory.name)
    readonly expenseCategoryModel: Model<ExpenseCategory>,
    @InjectModel(Income.name) readonly incomeModel: Model<Income>,
    @InjectModel(IncomeCategory.name)
    readonly incomeCategoryModel: Model<IncomeCategory>,
  ) {}

  async general(userId: string): Promise<any> {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const totalExpenses = await this.expenseModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: { $toDouble: '$price' } },
        },
      },
    ]);

    const totalIncomes = await this.incomeModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: { $toDouble: '$price' } },
        },
      },
    ]);

    const currentMonthOfExpense = await this.expenseModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: { $toDouble: '$price' } },
        },
      },
    ]);
    const currentMonthOfIncome = await this.incomeModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: { $toDouble: '$price' } },
        },
      },
    ]);

    return {
      totalExpenses: totalExpenses[0]?.totalPrice || 0,
      totalIncomes: totalIncomes[0]?.totalPrice || 0,
      currentMonthOfExpense: currentMonthOfExpense[0]?.totalPrice || 0,
      currentMonthOfIncome: currentMonthOfIncome[0]?.totalPrice || 0,
    };
  }
  async income(userId: string): Promise<any> {
    const result = await this.incomeModel.aggregate([
      {
        $lookup: {
          from: 'incomecategories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: '$category',
          name: { $first: '$category.name' },
          totalPrice: { $sum: { $toDouble: '$price' } },
        },
      },
      {
        $project: {
          _id: '$_id',
          name: 1,
          totalPrice: 1,
        },
      },
    ]);
    return result;
  }

  async expense(userId: string): Promise<any> {
    const result = await this.expenseModel.aggregate([
      {
        $lookup: {
          from: 'expensecategories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: '$category',
          name: { $first: '$category.name' },
          totalPrice: { $sum: { $toDouble: '$price' } },
        },
      },
      {
        $project: {
          _id: '$_id',
          name: 1,
          totalPrice: 1,
        },
      },
    ]);
    return result;
  }
}
