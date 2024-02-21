import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GetCurrentEnvironmentPath } from 'src/config/environment';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from 'src/auth/common/guards';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ExpenseModule } from 'src/expense/expense.module';
import { IncomeModule } from 'src/income/income.module';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: GetCurrentEnvironmentPath(),
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    ExpenseModule,
    IncomeModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
