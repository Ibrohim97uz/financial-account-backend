import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/common/decorators';
import { UserFromRequest } from 'src/auth/common/decorators/decorators';
import { CreateIncomeCategoryDto } from './dto/create-income-category.dto';
import { UpdateIncomeCategoryDto } from './dto/update-income-category.dto';

@Controller('income')
@ApiTags('Income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(
    @Body() createIncomeDto: CreateIncomeDto,
    @GetCurrentUser() user: UserFromRequest,
  ) {
    return this.incomeService.create(createIncomeDto, user.id);
  }
  @Post('/category')
  createCategory(
    @Body() createIncomeDto: CreateIncomeCategoryDto,
    @GetCurrentUser() user: UserFromRequest,
  ) {
    return this.incomeService.createCategory(createIncomeDto, user.id);
  }

  @Get()
  findAll(@GetCurrentUser() user: UserFromRequest) {
    return this.incomeService.findAll(user.id);
  }
  @Get('/category')
  findAllCategory(@GetCurrentUser() user: UserFromRequest) {
    return this.incomeService.findAllCategory(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomeService.findOne(id);
  }
  @Get('/category/:id')
  findOneCategory(@Param('id') id: string) {
    return this.incomeService.findOneCategory(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomeService.update(id, updateIncomeDto);
  }
  @Patch('/category/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateIncomeCategoryDto: UpdateIncomeCategoryDto,
  ) {
    return this.incomeService.updateCategory(id, updateIncomeCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incomeService.remove(id);
  }
  @Delete('/category/:id')
  removeCategory(@Param('id') id: string) {
    return this.incomeService.removeCategory(id);
  }
}
