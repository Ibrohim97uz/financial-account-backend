import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateExpenseCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}
