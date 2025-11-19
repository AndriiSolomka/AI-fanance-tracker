import { BudgetPeriod } from '@prisma/client';

export class CreateBudgetDto {
  userId: string;
  categoryId: string;
  limitAmount: number;
  limitCurrency: string;
  period: BudgetPeriod;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  alertThreshold?: number;
}
