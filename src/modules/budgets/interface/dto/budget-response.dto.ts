import { BudgetPeriod } from '../../domain/enums/budget-period.enum';
import { BudgetStatus } from '../../domain/enums/budget-status.enum';

export class BudgetResponseDto {
  id: string;
  userId: string;
  categoryId: string;
  limitAmount: number;
  limitCurrency: string;
  spentAmount: number;
  period: BudgetPeriod;
  status: BudgetStatus;
  startDate: Date;
  endDate: Date;
  alertThreshold: number;
  usagePercentage: number;
  remainingAmount: number;
  createdAt: Date;
}
