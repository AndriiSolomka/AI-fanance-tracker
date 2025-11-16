import { Injectable } from '@nestjs/common';
import { BudgetRepository } from '../repositories/budget.repository';
import { Budget } from '../../domain/entities/budget.entity';
import { BudgetPeriod } from '../../domain/enums/budget-period.enum';
import { BudgetStatus } from '../../domain/enums/budget-status.enum';

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
      alertThreshold,
    });
  }

  async updateBudget(id: string, updateData: Partial<Budget>): Promise<Budget> {
    const budget = await this.budgetRepository.update(id, updateData);
    if (!budget) {
      throw new Error('Budget not found');
    }
    return budget;
  }

  async deleteBudget(id: string): Promise<void> {
    const deleted = await this.budgetRepository.delete(id);
    if (!deleted) {
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

    const newSpentAmount = budget.spentAmount + transactionAmount;
    const updatedBudget = await this.budgetRepository.updateSpent(
      budget.id,
      newSpentAmount,
    );

    if (!updatedBudget) {
      throw new Error('Failed to update budget');
    }

    // Calculate usage percentage
    const usagePercentage =
      updatedBudget.limitAmount === 0
        ? 0
        : (updatedBudget.spentAmount / updatedBudget.limitAmount) * 100;

    // Check if exceeded
    const exceeded = updatedBudget.spentAmount > updatedBudget.limitAmount;

    // Check if should alert
    const alert = usagePercentage >= updatedBudget.alertThreshold;

    let newStatus = budget.status;
    if (exceeded) {
      newStatus = BudgetStatus.EXCEEDED;
    } else if (alert) {
      newStatus = BudgetStatus.WARNING;
    }

    if (newStatus !== budget.status) {
      await this.budgetRepository.update(budget.id, { status: newStatus });
    }

    let message = 'Budget is OK';
    if (exceeded) {
      message = `Budget exceeded! Spent ${updatedBudget.spentAmount} of ${updatedBudget.limitAmount} ${updatedBudget.limitCurrency}`;
    } else if (alert) {
      message = `Budget warning! You've spent ${usagePercentage.toFixed(1)}% of your budget`;
    }

    return {
      budget: updatedBudget,
      isExceeded: exceeded,
      shouldAlert: alert,
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
      budget.limitAmount === 0
        ? 0
        : (budget.spentAmount / budget.limitAmount) * 100;

    return {
      limitAmount: budget.limitAmount,
      spentAmount: budget.spentAmount,
      remainingAmount: budget.limitAmount - budget.spentAmount,
      usagePercentage,
      status: budget.status,
    };
  }
}
