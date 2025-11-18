import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany();
    return transactions.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      categoryId: tx.categoryId,
      type: tx.type as TransactionType,
      amount: Number(tx.amount),
      currency: tx.currency,
      description: tx.description || '',
      date: tx.date,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }));
  }

  async findById(id: string): Promise<Transaction | null> {
    const tx = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!tx) return null;

    return {
      id: tx.id,
      userId: tx.userId,
      categoryId: tx.categoryId,
      type: tx.type as TransactionType,
      amount: Number(tx.amount),
      currency: tx.currency,
      description: tx.description || '',
      date: tx.date,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    };
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      categoryId: tx.categoryId,
      type: tx.type as TransactionType,
      amount: Number(tx.amount),
      currency: tx.currency,
      description: tx.description || '',
      date: tx.date,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }));
  }

  async findByCategoryId(categoryId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { categoryId },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      categoryId: tx.categoryId,
      type: tx.type as TransactionType,
      amount: Number(tx.amount),
      currency: tx.currency,
      description: tx.description || '',
      date: tx.date,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }));
  }

  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      categoryId: tx.categoryId,
      type: tx.type as TransactionType,
      amount: Number(tx.amount),
      currency: tx.currency,
      description: tx.description || '',
      date: tx.date,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }));
  }

  async findByType(
    userId: string,
    type: TransactionType,
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type,
      },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      categoryId: tx.categoryId,
      type: tx.type as TransactionType,
      amount: Number(tx.amount),
      currency: tx.currency,
      description: tx.description || '',
      date: tx.date,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }));
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
    const { userId, categoryId, type, amount, currency, description, date } =
      txData;

    const tx = await this.prisma.transaction.create({
      data: {
        userId,
        categoryId,
        type,
        amount,
        currency: currency || 'USD',
        description,
        date,
      },
    });

    return {
      id: tx.id,
      userId: tx.userId,
      categoryId: tx.categoryId,
      type: tx.type as TransactionType,
      amount: Number(tx.amount),
      currency: tx.currency,
      description: tx.description || '',
      date: tx.date,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    };
  }

  async update(
    id: string,
    txData: Partial<Transaction>,
  ): Promise<Transaction | null> {
    try {
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

      return {
        id: tx.id,
        userId: tx.userId,
        categoryId: tx.categoryId,
        type: tx.type as TransactionType,
        amount: Number(tx.amount),
        currency: tx.currency,
        description: tx.description || '',
        date: tx.date,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      };
    } catch {
      return null;
    }
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
