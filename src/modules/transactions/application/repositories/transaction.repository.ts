import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Transaction, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  // async findAll(): Promise<TransactionType[]> {
  //   return (await this.prisma.transaction.findMany()).map((tx) => ({
  //     id: tx.id,
  //     userId: tx.userId,
  //     categoryId: tx.categoryId,
  //     type: tx.type,
  //     amount: Number(tx.amount),
  //     currency: tx.currency,
  //     description: tx.description || '',
  //     date: tx.date,
  //     createdAt: tx.createdAt,
  //     updatedAt: tx.updatedAt,
  //   }));
  // }

  async findById(id: string): Promise<Transaction | null> {
    const tx = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!tx) return null;

    return { ...tx };
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany({
      where: { userId },
    });
  }

  async findByCategoryId(categoryId: string): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany({
      where: { categoryId },
    });
  }

  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async findByType(
    userId: string,
    type: TransactionType,
  ): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany({
      where: {
        userId,
        type,
      },
    });
  }

  async create(txData: {
    userId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    currency?: string;
    description?: string;
    date: Date;
  }): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        userId: txData.userId,
        categoryId: txData.categoryId,
        type: txData.type,
        amount: txData.amount,
        currency: txData.currency || 'USD',
        description: txData.description,
        date: txData.date,
      },
    });
  }

  async update(
    id: string,
    txData: Partial<Transaction>,
  ): Promise<Transaction | null> {
    const tx = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...(txData.categoryId && { categoryId: txData.categoryId }),
        ...(txData.type && { type: txData.type }),
        ...(txData.amount && { amount: txData.amount }),
        ...(txData.currency && { currency: txData.currency }),
        ...(txData.description !== undefined && {
          description: txData.description,
        }),
        ...(txData.date && { date: txData.date }),
        updatedAt: new Date(),
      },
    });

    return { ...tx };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.transaction.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
