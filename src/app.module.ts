import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BudgetsModule } from './modules/budgets/budgets.module';

@Module({
  imports: [AuthModule, CategoriesModule, TransactionsModule, BudgetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
