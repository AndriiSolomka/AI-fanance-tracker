import { Module } from '@nestjs/common';
import { BudgetController } from './interface/controllers/budget.controller';
import { BudgetService } from './application/services/budget.service';
import { BudgetRepository } from './application/repositories/budget.repository';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService, BudgetRepository],
  exports: [BudgetService, BudgetRepository],
})
export class BudgetsModule {}
