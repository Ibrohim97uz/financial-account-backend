import { Test, TestingModule } from '@nestjs/testing';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';

describe('IncomeController', () => {
  let controller: IncomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeController],
      providers: [IncomeService],
    }).compile();

    controller = module.get<IncomeController>(IncomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
