import { Injectable } from '@nestjs/common';
import { Budget } from '../../domain/entities/budget.entity';
import { BudgetPeriod } from '../../domain/enums/budget-period.enum';
import { BudgetStatus } from '../../domain/enums/budget-status.enum';

@Injectable()
export class BudgetRepository {
  private budgets = new Map<string, Budget>();
  private idCounter = 5;

  constructor() {
    const budget1: Budget = {
      id: '1',
      userId: '1',
      categoryId: '1',
      limitAmount: 500.0,
      limitCurrency: 'USD',
      spentAmount: 345.99,
      period: BudgetPeriod.MONTHLY,
      status: BudgetStatus.ACTIVE,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-31'),
      alertThreshold: 80,
      createdAt: new Date('2024-09-25'),
    };
    const budget2: Budget = {
      id: '2',
      userId: '1',
      categoryId: '2',
      limitAmount: 300.0,
      limitCurrency: 'USD',
      spentAmount: 120.0,
      period: BudgetPeriod.MONTHLY,
      status: BudgetStatus.ACTIVE,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-31'),
      alertThreshold: 80,
      createdAt: new Date('2024-09-25'),
    };
    const budget3: Budget = {
      id: '3',
      userId: '1',
      categoryId: '4',
      limitAmount: 250.0,
      limitCurrency: 'USD',
      spentAmount: 200.0,
      period: BudgetPeriod.MONTHLY,
      status: BudgetStatus.WARNING,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-31'),
      alertThreshold: 80,
      createdAt: new Date('2024-09-25'),
    };
    const budget4: Budget = {
      id: '4',
      userId: '2',
      categoryId: '3',
      limitAmount: 200.0,
      limitCurrency: 'USD',
      spentAmount: 85.0,
      period: BudgetPeriod.MONTHLY,
      status: BudgetStatus.ACTIVE,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-31'),
      alertThreshold: 80,
      createdAt: new Date('2024-09-25'),
    };

    this.budgets.set('1', budget1);
    this.budgets.set('2', budget2);
    this.budgets.set('3', budget3);
    this.budgets.set('4', budget4);
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
    return Array.from(this.budgets.values()).find(
      (budget) =>
        budget.userId === userId &&
        budget.categoryId === categoryId &&
        budget.status === BudgetStatus.ACTIVE,
    );
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
