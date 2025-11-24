import { Injectable } from '@nestjs/common';
import { BudgetRepository } from '../repositories/budget.repository';
import { Budget, BudgetPeriod, BudgetStatus } from '@prisma/client';

@Injectable()
export class BudgetService {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  async getAllBudgets(): Promise<Budget[]> {
    return this.budgetRepository.findAll();
  }

  async getBudgetById(id: string): Promise<Budget> {
    const budget = await this.budgetRepository.findById(id);
    if (!budget) {
      throw new Error('Budget not found');
    }
    return budget;
  }

  async getBudgetsByUserId(userId: string): Promise<Budget[]> {
    return this.budgetRepository.findByUserId(userId);
  }

  async getBudgetsByCategoryId(categoryId: string): Promise<Budget[]> {
    return this.budgetRepository.findByCategoryId(categoryId);
  }

  async getBudgetsByStatus(
    userId: string,
    status: BudgetStatus,
  ): Promise<Budget[]> {
    return this.budgetRepository.findByStatus(userId, status);
  }

  async createBudget(
    userId: string,
    categoryId: string,
    limitAmount: number,
    limitCurrency: string,
    period: BudgetPeriod,
    startDate: Date,
    endDate: Date,
    alertThreshold: number = 80,
  ): Promise<Budget> {
    const normalizedAlert =
      alertThreshold > 1 ? alertThreshold / 100 : alertThreshold;

    return this.budgetRepository.create({
      userId,
      categoryId,
      limitAmount,
      limitCurrency,
      spentAmount: 0,
      period,
      status: BudgetStatus.CREATED,
      startDate,
      endDate,
      alertThreshold: normalizedAlert,
    });
  }

  async updateBudget(
    id: string,
    updateData: Partial<Omit<Budget, 'id' | 'createdAt'>>,
  ): Promise<Budget> {
    const budget = await this.budgetRepository.update(id, updateData);
    if (!budget) {
      throw new Error('Budget not found');
    }
    return budget;
  }

  async deleteBudget(id: string): Promise<void> {
    if (!(await this.budgetRepository.delete(id))) {
      throw new Error('Budget not found');
    }
  }

  async checkBudget(
    userId: string,
    categoryId: string,
    transactionAmount: number,
  ): Promise<{
    budget: Budget | null;
    isExceeded: boolean;
    shouldAlert: boolean;
    message: string;
  }> {
    const budget = await this.budgetRepository.findActiveByCategory(
      userId,
      categoryId,
    );

    if (!budget) {
      return {
        budget: null,
        isExceeded: false,
        shouldAlert: false,
        message: 'No active budget for this category',
      };
    }

    const newSpentAmount = Number(budget.spentAmount) + transactionAmount;

    const updatedBudget = await this.budgetRepository.updateSpent(
      budget.id,
      newSpentAmount,
    );

    if (!updatedBudget) {
      throw new Error('Failed to update budget');
    }

    const limit = Number(updatedBudget.limitAmount);

    const usagePercentage =
      limit === 0 ? 0 : (Number(updatedBudget.spentAmount) / limit) * 100;

    const alertThreshold = Number(updatedBudget.alertThreshold);
    const isExceeded =
      Number(updatedBudget.spentAmount) > Number(updatedBudget.limitAmount);

    const shouldAlert = usagePercentage >= alertThreshold * 100;

    let newStatus = updatedBudget.status;

    if (isExceeded) {
      newStatus = BudgetStatus.EXCEEDED;
    } else if (shouldAlert) {
      newStatus = BudgetStatus.WARNING;
    }

    if (newStatus !== updatedBudget.status) {
      await this.budgetRepository.update(updatedBudget.id, {
        status: newStatus,
      });
    }

    let message = 'Budget is OK';

    if (isExceeded) {
      message = `Budget exceeded! Spent ${Number(updatedBudget.spentAmount)} of ${Number(updatedBudget.limitAmount)} ${updatedBudget.limitCurrency}`;
    } else if (shouldAlert) {
      message = `Budget warning! You've spent ${usagePercentage.toFixed(1)}% of your budget`;
    }

    return {
      budget: updatedBudget,
      isExceeded,
      shouldAlert,
      message,
    };
  }

  async getBudgetStats(budgetId: string): Promise<{
    limitAmount: number;
    spentAmount: number;
    remainingAmount: number;
    usagePercentage: number;
    status: BudgetStatus;
  }> {
    const budget = await this.budgetRepository.findById(budgetId);
    if (!budget) {
      throw new Error('Budget not found');
    }

    const usagePercentage =
      Number(budget.limitAmount) === 0
        ? 0
        : (Number(budget.spentAmount) / Number(budget.limitAmount)) * 100;

    return {
      limitAmount: Number(budget.limitAmount),
      spentAmount: Number(budget.spentAmount),
      remainingAmount: Number(budget.limitAmount) - Number(budget.spentAmount),
      usagePercentage,
      status: budget.status,
    };
  }
}
