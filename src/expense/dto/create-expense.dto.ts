import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty()
  @IsString()
  category: any;
  @ApiProperty()
  @IsNumber()
  price: number;
  @ApiProperty()
  @IsString()
  date: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  comment: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  sortedId?: string;
  id?: string;
}
