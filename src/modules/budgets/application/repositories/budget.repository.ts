import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Budget, Prisma } from '@prisma/client';
import { BudgetPeriod } from '@prisma/client';
import { BudgetStatus } from '@prisma/client';

@Injectable()
export class BudgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Budget[]> {
    return await this.prisma.budget.findMany();
  }

  async findById(id: string): Promise<Budget | null> {
    return await this.prisma.budget.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Budget[]> {
    return await this.prisma.budget.findMany({
      where: { userId },
    });
  }

  async findByCategoryId(categoryId: string): Promise<Budget[]> {
    return await this.prisma.budget.findMany({
      where: { categoryId },
    });
  }

  async findActiveByCategory(
    userId: string,
    categoryId: string,
  ): Promise<Budget | null> {
    return await this.prisma.budget.findFirst({
      where: {
        userId,
        categoryId,
        status: BudgetStatus.ACTIVE,
      },
    });
  }

  async findByStatus(userId: string, status: BudgetStatus): Promise<Budget[]> {
    return await this.prisma.budget.findMany({
      where: {
        userId,
        status: status,
      },
    });
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
    return await this.prisma.budget.create({
      data: {
        userId: budgetData.userId,
        categoryId: budgetData.categoryId,
        limitAmount: budgetData.limitAmount,
        limitCurrency: budgetData.limitCurrency || 'USD',
        spentAmount: budgetData.spentAmount || 0,
        period: budgetData.period,
        status: budgetData.status || BudgetStatus.CREATED,
        startDate: budgetData.startDate,
        endDate: budgetData.endDate,
        alertThreshold: budgetData.alertThreshold || 0.8,
      },
    });
  }

  async update(
    id: string,
    budgetData: Prisma.BudgetUncheckedUpdateInput,
  ): Promise<Budget | null> {
    try {
      return await this.prisma.budget.update({
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
          ...(budgetData.period && { period: budgetData.period }),
          ...(budgetData.status && { status: budgetData.status }),
          ...(budgetData.startDate && { startDate: budgetData.startDate }),
          ...(budgetData.endDate && { endDate: budgetData.endDate }),
          ...(budgetData.alertThreshold !== undefined && {
            alertThreshold: budgetData.alertThreshold,
          }),
        },
      });
    } catch {
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
    } catch {
      return false;
    }
  }
}
