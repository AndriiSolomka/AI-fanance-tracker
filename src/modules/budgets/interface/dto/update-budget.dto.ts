import { BudgetPeriod } from '../../domain/enums/budget-period.enum';
import { BudgetStatus } from '../../domain/enums/budget-status.enum';

export class UpdateBudgetDto {
  limitAmount?: number;
  limitCurrency?: string;
  period?: BudgetPeriod;
  status?: BudgetStatus;
  startDate?: string;
  endDate?: string;
  alertThreshold?: number;
}
