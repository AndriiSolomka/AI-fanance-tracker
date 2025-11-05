import { BudgetPeriod } from '../enums/budget-period.enum';
import { BudgetStatus } from '../enums/budget-status.enum';

export type CreateBudgetInput = {
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
};
