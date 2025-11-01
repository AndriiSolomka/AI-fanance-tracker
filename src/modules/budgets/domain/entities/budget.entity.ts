import { BudgetPeriod } from '../enums/budget-period.enum';
import { BudgetStatus } from '../enums/budget-status.enum';

export type Budget = {
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
  createdAt: Date;
};
