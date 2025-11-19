import { BudgetPeriod } from '@prisma/client';
import { BudgetStatus } from '@prisma/client';

export class UpdateBudgetDto {
  limitAmount?: number;
  limitCurrency?: string;
  period?: BudgetPeriod;
  status?: BudgetStatus;
  startDate?: string;
  endDate?: string;
  alertThreshold?: number;
}
