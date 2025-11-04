import { Injectable } from '@nestjs/common';
import { Budget } from '../../domain/entities/budget.entity';
import { BudgetPeriod } from '../../domain/enums/budget-period.enum';
import { BudgetStatus } from '../../domain/enums/budget-status.enum';
import { budgetsMock } from '../../constants/budgets.mock';

@Injectable()
export class BudgetRepository {
  private budgets = new Map<string, Budget>();
  private idCounter = 5;

  constructor() {
    budgetsMock.forEach(budget => {
      this.budgets.set(budget.id, budget);
    });
  }

  findAll(): Budget[] {
    return Array.from(this.budgets.values());
  }

  findById(id: string): Budget | undefined {
    return this.budgets.get(id);
  }

  findByUserId(userId: string): Budget[] {
    return Array.from(this.budgets.values()).filter(
      (budget) => budget.userId === userId,
    );
  }

  findByCategoryId(categoryId: string): Budget[] {
    return Array.from(this.budgets.values()).filter(
      (budget) => budget.categoryId === categoryId,
    );
  }

  findActiveByCategory(userId: string, categoryId: string): Budget | undefined {
    return Array.from(this.budgets.values()).find((budget) => {
      const { userId: uid, categoryId: cid, status } = budget;
      return (
        uid === userId && cid === categoryId && status === BudgetStatus.ACTIVE
      );
    });
  }

  findByStatus(userId: string, status: BudgetStatus): Budget[] {
    return Array.from(this.budgets.values()).filter(
      (budget) => budget.userId === userId && budget.status === status,
    );
  }

  create(budgetData: {
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
  }): Budget {
    const id = (this.idCounter++).toString();
    const newBudget: Budget = {
      ...budgetData,
      id,
      createdAt: new Date(),
    };
    this.budgets.set(id, newBudget);
    return newBudget;
  }

  update(id: string, budgetData: Partial<Budget>): Budget | undefined {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;

    const updatedBudget = {
      ...budget,
      ...budgetData,
    };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }

  updateSpent(id: string, spentAmount: number): Budget | undefined {
    return this.update(id, { spentAmount });
  }

  delete(id: string): boolean {
    return this.budgets.delete(id);
  }
}
