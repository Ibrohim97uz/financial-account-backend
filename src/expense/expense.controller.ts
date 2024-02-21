import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/common/decorators';
import { UserFromRequest } from 'src/auth/common/decorators/decorators';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';

@Controller('expense')
@ApiTags('Expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @GetCurrentUser() user: UserFromRequest,
  ) {
    return this.expenseService.create(createExpenseDto, user.id);
  }
  @Post('/category')
  createCategory(
    @Body() createExpenseDto: CreateExpenseCategoryDto,
    @GetCurrentUser() user: UserFromRequest,
  ) {
    return this.expenseService.createCategory(createExpenseDto, user.id);
  }

  @Get()
  findAll(@GetCurrentUser() user: UserFromRequest) {
    return this.expenseService.findAll(user.id);
  }

  @Get('/category')
  findAllCategory(@GetCurrentUser() user: UserFromRequest) {
    return this.expenseService.findAllCategory(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }
  @Get('/category/:id')
  findOneCategory(@Param('id') id: string) {
    return this.expenseService.findOneCategory(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }
  @Patch('/category/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto,
  ) {
    return this.expenseService.updateCategory(id, updateExpenseCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
  @Delete('/category/:id')
  removeCategory(@Param('id') id: string) {
    return this.expenseService.removeCategory(id);
  }
}
