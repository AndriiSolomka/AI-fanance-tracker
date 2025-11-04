import { Injectable } from '@nestjs/common';
import { BudgetRepository } from '../repositories/budget.repository';
import { Budget } from '../../domain/entities/budget.entity';
import { BudgetPeriod } from '../../domain/enums/budget-period.enum';
import { BudgetStatus } from '../../domain/enums/budget-status.enum';

@Injectable()
export class BudgetService {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  getAllBudgets(): Budget[] {
    return this.budgetRepository.findAll();
  }

  getBudgetById(id: string): Budget {
    const budget = this.budgetRepository.findById(id);
    if (!budget) {
      throw new Error('Budget not found');
    }
    return budget;
  }

  getBudgetsByUserId(userId: string): Budget[] {
    return this.budgetRepository.findByUserId(userId);
  }

  getBudgetsByCategoryId(categoryId: string): Budget[] {
    return this.budgetRepository.findByCategoryId(categoryId);
  }

  getBudgetsByStatus(userId: string, status: BudgetStatus): Budget[] {
    return this.budgetRepository.findByStatus(userId, status);
  }

  createBudget(
    userId: string,
    categoryId: string,
    limitAmount: number,
    limitCurrency: string,
    period: BudgetPeriod,
    startDate: Date,
    endDate: Date,
    alertThreshold: number = 80,
  ): Budget {
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

  updateBudget(id: string, updateData: Partial<Budget>): Budget {
    const budget = this.budgetRepository.update(id, updateData);
    if (!budget) {
      throw new Error('Budget not found');
    }
    return budget;
  }

  deleteBudget(id: string): void {
    const deleted = this.budgetRepository.delete(id);
    if (!deleted) {
      throw new Error('Budget not found');
    }
  }

  checkBudget(
    userId: string,
    categoryId: string,
    transactionAmount: number,
  ): {
    budget: Budget | null;
    isExceeded: boolean;
    shouldAlert: boolean;
    message: string;
  } {
    const budget = this.budgetRepository.findActiveByCategory(
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
    const updatedBudget = this.budgetRepository.updateSpent(
      budget.id,
      newSpentAmount,
    );

    if (!updatedBudget) {
      throw new Error('Failed to update budget');
    }

    const usagePercentage =
      updatedBudget.limitAmount === 0
        ? 0
        : (updatedBudget.spentAmount / updatedBudget.limitAmount) * 100;

    const exceeded = updatedBudget.spentAmount > updatedBudget.limitAmount;

    const alert = usagePercentage >= updatedBudget.alertThreshold;

    let newStatus = budget.status;
    if (exceeded) {
      newStatus = BudgetStatus.EXCEEDED;
    } else if (alert) {
      newStatus = BudgetStatus.WARNING;
    }

    if (newStatus !== budget.status) {
      this.budgetRepository.update(budget.id, { status: newStatus });
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

  getBudgetStats(budgetId: string): {
    limitAmount: number;
    spentAmount: number;
    remainingAmount: number;
    usagePercentage: number;
    status: BudgetStatus;
  } {
    const budget = this.budgetRepository.findById(budgetId);
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
