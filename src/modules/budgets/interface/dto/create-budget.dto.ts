import { BudgetPeriod } from '../../domain/enums/budget-period.enum';

export class CreateBudgetDto {
  userId: string;
  categoryId: string;
  limitAmount: number;
  limitCurrency: string;
  period: BudgetPeriod;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  alertThreshold?: number; // по умолчанию 80
}
