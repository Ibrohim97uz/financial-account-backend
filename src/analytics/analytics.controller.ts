import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { GetCurrentUser } from 'src/auth/common/decorators';
import { UserFromRequest } from 'src/auth/common/decorators/decorators';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/general')
  general(@GetCurrentUser() user: UserFromRequest) {
    return this.analyticsService.general(user.id);
  }
  @Get('/expense')
  expense(@GetCurrentUser() user: UserFromRequest) {
    return this.analyticsService.expense(user.id);
  }
  @Get('/income')
  income(@GetCurrentUser() user: UserFromRequest) {
    return this.analyticsService.income(user.id);
  }
}
