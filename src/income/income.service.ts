import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Income } from './entities/income.entity';
import mongoose, { Model } from 'mongoose';
import { CreateIncomeCategoryDto } from './dto/create-income-category.dto';
import { IncomeCategory } from './entities/income-category';
import { UpdateIncomeCategoryDto } from './dto/update-income-category.dto';

@Injectable()
export class IncomeService {
  constructor(
    @InjectModel(Income.name) readonly incomeModel: Model<Income>,
    @InjectModel(IncomeCategory.name)
    readonly incomeCategoryModel: Model<IncomeCategory>,
  ) {}
  async create(
    createIncomeDto: CreateIncomeDto,
    userId: string,
  ): Promise<Income> {
    return this.incomeModel.create({
      ...createIncomeDto,
      category: new mongoose.Types.ObjectId(createIncomeDto.category as string),
      userId: new mongoose.Types.ObjectId(userId),
    });
  }
  async createCategory(
    createIncomeCategoryDto: CreateIncomeCategoryDto,
    userId: string,
  ): Promise<IncomeCategory> {
    return this.incomeCategoryModel.create({
      ...createIncomeCategoryDto,
      userId,
    });
  }
  async findAll(userId: string): Promise<Array<Income>> {
    return this.incomeModel.aggregate([
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
          from: 'incomecategories',
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
  }

  async findAllCategory(userId: string): Promise<Array<IncomeCategory>> {
    return this.incomeCategoryModel.aggregate([
      {
        $match: {
          userId: userId,
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

  async findOne(id: string): Promise<Income> {
    const income = await this.incomeModel.findById(id);
    if (!income) throw new NotFoundException('Not found');
    return income;
  }
  async findOneCategory(id: string): Promise<IncomeCategory> {
    const incomeCategory = await this.incomeCategoryModel.findById(id);
    if (!incomeCategory) throw new NotFoundException('Not found');
    return incomeCategory;
  }

  async update(id: string, updateIncomeDto: UpdateIncomeDto): Promise<Income> {
    await this.findOne(id);

    return this.incomeModel.findByIdAndUpdate(id, {
      ...updateIncomeDto,
      updatedAt: new Date(),
      category: new mongoose.Types.ObjectId(updateIncomeDto.category as string),
    });
  }
  async updateCategory(
    id: string,
    updateIncomeCategoryDto: UpdateIncomeCategoryDto,
  ): Promise<IncomeCategory> {
    await this.findOneCategory(id);

    return this.incomeCategoryModel.findByIdAndUpdate(id, {
      ...updateIncomeCategoryDto,
      updatedAt: new Date(),
    });
  }

  async remove(id: string): Promise<Income> {
    await this.findOne(id);
    return this.incomeModel.findByIdAndDelete(id);
  }

  async removeCategory(id: string): Promise<IncomeCategory> {
    await this.findOneCategory(id);
    return this.incomeCategoryModel.findByIdAndDelete(id);
  }
}
