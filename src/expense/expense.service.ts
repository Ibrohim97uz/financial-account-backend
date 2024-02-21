import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './entities/expense.entity';
import mongoose, { Model } from 'mongoose';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { ExpenseCategory } from './entities/expense-category';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) readonly expenseModel: Model<Expense>,
    @InjectModel(ExpenseCategory.name)
    readonly expenseCategoryModel: Model<ExpenseCategory>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<Expense> {
    return this.expenseModel.create({
      ...createExpenseDto,
      category: new mongoose.Types.ObjectId(
        createExpenseDto.category as string,
      ),
      userId: new mongoose.Types.ObjectId(userId),
    });
  }
  async createCategory(
    createExpenseCategoryDto: CreateExpenseCategoryDto,
    userId: string,
  ): Promise<ExpenseCategory> {
    return this.expenseCategoryModel.create({
      ...createExpenseCategoryDto,
      userId,
    });
  }
  async findAll(userId: string): Promise<Array<Expense>> {
    return this.expenseModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $group: {
          _id: 1,
          items: {
            $push: {
              _id: '$_id',
              userId: '$userId',
              category: '$category',
              price: '$price',
              date: '$date',
              comment: '$comment',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
          },
        },
      },
      {
        $unwind: {
          path: '$items',
          includeArrayIndex: 'sortedId',
        },
      },
      {
        $project: {
          _id: '$items._id',
          userId: '$items.userId',
          category: '$items.category',
          price: '$items.price',
          date: '$items.date',
          comment: '$items.comment',
          createdAt: '$items.createdAt',
          updatedAt: '$items.updatedAt',
          sortedId: {
            $add: ['$sortedId', 1],
          },
        },
      },
      {
        $sort: {
          sortedId: 1,
        },
      },
      {
        $lookup: {
          from: 'expensecategories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
        },
      },
    ]);

    // return this.expenseModel.find({ userId });
  }
  async findAllCategory(userId: string): Promise<Array<ExpenseCategory>> {
    return this.expenseCategoryModel.aggregate([
      {
        $match: {
          userId,
        },
      },

      {
        $group: {
          _id: 1,
          items: {
            $push: {
              _id: '$_id',
              userId: '$userId',
              name: '$name',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
          },
        },
      },
      {
        $unwind: {
          path: '$items',
          includeArrayIndex: 'sortedId',
        },
      },
      {
        $project: {
          _id: '$items._id',
          userId: '$items.userId',
          name: '$items.name',
          createdAt: '$items.createdAt',
          updatedAt: '$items.updatedAt',
          sortedId: {
            $add: ['$sortedId', 1],
          },
        },
      },
      {
        $sort: {
          sortedId: 1,
        },
      },
    ]);
  }
  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findById(id);
    if (!expense) throw new NotFoundException('Not found');
    return expense;
  }
  async findOneCategory(id: string): Promise<ExpenseCategory> {
    const expenseCategory = await this.expenseCategoryModel.findById(id);
    if (!expenseCategory) throw new NotFoundException('Not found');
    return expenseCategory;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    await this.findOne(id);

    return this.expenseModel.findByIdAndUpdate(id, {
      ...updateExpenseDto,
      updatedAt: new Date(),
      category: new mongoose.Types.ObjectId(
        updateExpenseDto.category as string,
      ),
    });
  }
  async updateCategory(
    id: string,
    updateExpenseCategoryDto: UpdateExpenseCategoryDto,
  ): Promise<ExpenseCategory> {
    await this.findOneCategory(id);

    return this.expenseCategoryModel.findByIdAndUpdate(id, {
      ...updateExpenseCategoryDto,
      updatedAt: new Date(),
    });
  }

  async remove(id: string): Promise<Expense> {
    await this.findOne(id);
    return this.expenseModel.findByIdAndDelete(id);
  }

  async removeCategory(id: string): Promise<ExpenseCategory> {
    await this.findOneCategory(id);
    return this.expenseCategoryModel.findByIdAndDelete(id);
  }
}
