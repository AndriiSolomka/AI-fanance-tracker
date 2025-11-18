import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Budget } from '../../domain/entities/budget.entity';
import { BudgetPeriod } from '../../domain/enums/budget-period.enum';
import { BudgetStatus } from '../../domain/enums/budget-status.enum';

@Injectable()
export class BudgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Budget[]> {
    const budgets = await this.prisma.budget.findMany();
    return budgets.map((budget) => ({
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      limitAmount: Number(budget.limitAmount),
      limitCurrency: budget.limitCurrency,
      spentAmount: Number(budget.spentAmount),
      period: budget.period as BudgetPeriod,
      status: budget.status as BudgetStatus,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: Number(budget.alertThreshold),
      createdAt: budget.createdAt,
    }));
  }

  async findById(id: string): Promise<Budget | null> {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
    });

    if (!budget) return null;

    return {
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      limitAmount: Number(budget.limitAmount),
      limitCurrency: budget.limitCurrency,
      spentAmount: Number(budget.spentAmount),
      period: budget.period as BudgetPeriod,
      status: budget.status as BudgetStatus,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: Number(budget.alertThreshold),
      createdAt: budget.createdAt,
    };
  }

  async findByUserId(userId: string): Promise<Budget[]> {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
    });

    return budgets.map((budget) => ({
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      limitAmount: Number(budget.limitAmount),
      limitCurrency: budget.limitCurrency,
      spentAmount: Number(budget.spentAmount),
      period: budget.period as BudgetPeriod,
      status: budget.status as BudgetStatus,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: Number(budget.alertThreshold),
      createdAt: budget.createdAt,
    }));
  }

  async findByCategoryId(categoryId: string): Promise<Budget[]> {
    const budgets = await this.prisma.budget.findMany({
      where: { categoryId },
    });

    return budgets.map((budget) => ({
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      limitAmount: Number(budget.limitAmount),
      limitCurrency: budget.limitCurrency,
      spentAmount: Number(budget.spentAmount),
      period: budget.period as BudgetPeriod,
      status: budget.status as BudgetStatus,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: Number(budget.alertThreshold),
      createdAt: budget.createdAt,
    }));
  }

  async findActiveByCategory(
    userId: string,
    categoryId: string,
  ): Promise<Budget | null> {
    const budget = await this.prisma.budget.findFirst({
      where: {
        userId,
        categoryId,
        status: BudgetStatus.ACTIVE as any,
      },
    });

    if (!budget) return null;

    return {
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      limitAmount: Number(budget.limitAmount),
      limitCurrency: budget.limitCurrency,
      spentAmount: Number(budget.spentAmount),
      period: budget.period as BudgetPeriod,
      status: budget.status as BudgetStatus,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: Number(budget.alertThreshold),
      createdAt: budget.createdAt,
    };
  }

  async findByStatus(userId: string, status: BudgetStatus): Promise<Budget[]> {
    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        status: status as any,
      },
    });

    return budgets.map((budget) => ({
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      limitAmount: Number(budget.limitAmount),
      limitCurrency: budget.limitCurrency,
      spentAmount: Number(budget.spentAmount),
      period: budget.period as BudgetPeriod,
      status: budget.status as BudgetStatus,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: Number(budget.alertThreshold),
      createdAt: budget.createdAt,
    }));
  }

  async create(budgetData: {
    userId: string;
    categoryId: string;
    limitAmount: number;
    limitCurrency?: string;
    spentAmount?: number;
    period: BudgetPeriod;
    status?: BudgetStatus;
    startDate: Date;
    endDate: Date;
    alertThreshold?: number;
  }): Promise<Budget> {
    const {
      userId,
      categoryId,
      limitAmount,
      limitCurrency,
      spentAmount,
      period,
      status,
      startDate,
      endDate,
      alertThreshold,
    } = budgetData;

    const budget = await this.prisma.budget.create({
      data: {
        userId,
        categoryId,
        limitAmount,
        limitCurrency: limitCurrency || 'USD',
        spentAmount: spentAmount || 0,
        period: period as any,
        status: (status || BudgetStatus.CREATED) as any,
        startDate,
        endDate,
        alertThreshold: alertThreshold || 0.8,
      },
    });

    return {
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      limitAmount: Number(budget.limitAmount),
      limitCurrency: budget.limitCurrency,
      spentAmount: Number(budget.spentAmount),
      period: budget.period as BudgetPeriod,
      status: budget.status as BudgetStatus,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: Number(budget.alertThreshold),
      createdAt: budget.createdAt,
    };
  }

  async update(
    id: string,
    budgetData: Partial<Budget>,
  ): Promise<Budget | null> {
    try {
      const budget = await this.prisma.budget.update({
        where: { id },
        data: {
          ...(budgetData.categoryId && { categoryId: budgetData.categoryId }),
          ...(budgetData.limitAmount && {
            limitAmount: budgetData.limitAmount,
          }),
          ...(budgetData.limitCurrency && {
            limitCurrency: budgetData.limitCurrency,
          }),
          ...(budgetData.spentAmount !== undefined && {
            spentAmount: budgetData.spentAmount,
          }),
          ...(budgetData.period && { period: budgetData.period as any }),
          ...(budgetData.status && { status: budgetData.status as any }),
          ...(budgetData.startDate && { startDate: budgetData.startDate }),
          ...(budgetData.endDate && { endDate: budgetData.endDate }),
          ...(budgetData.alertThreshold !== undefined && {
            alertThreshold: budgetData.alertThreshold,
          }),
        },
      });

      return {
        id: budget.id,
        userId: budget.userId,
        categoryId: budget.categoryId,
        limitAmount: Number(budget.limitAmount),
        limitCurrency: budget.limitCurrency,
        spentAmount: Number(budget.spentAmount),
        period: budget.period as BudgetPeriod,
        status: budget.status as BudgetStatus,
        startDate: budget.startDate,
        endDate: budget.endDate,
        alertThreshold: Number(budget.alertThreshold),
        createdAt: budget.createdAt,
      };
    } catch (error) {
      return null;
    }
  }

  async updateSpent(id: string, spentAmount: number): Promise<Budget | null> {
    return this.update(id, { spentAmount });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.budget.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
