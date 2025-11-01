import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

@Injectable()
export class TransactionRepository {
  // Статические данные для прототипа
  private transactions: Transaction[] = [
    {
      id: '1',
      userId: '1',
      categoryId: '1',
      type: TransactionType.EXPENSE,
      amount: 45.99,
      currency: 'USD',
      description: 'Lunch at restaurant',
      date: new Date('2024-10-15'),
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date('2024-10-15'),
    },
    {
      id: '2',
      userId: '1',
      categoryId: '2',
      type: TransactionType.EXPENSE,
      amount: 120.0,
      currency: 'USD',
      description: 'Gas station',
      date: new Date('2024-10-16'),
      createdAt: new Date('2024-10-16'),
      updatedAt: new Date('2024-10-16'),
    },
    {
      id: '3',
      userId: '1',
      categoryId: '5',
      type: TransactionType.INCOME,
      amount: 5000.0,
      currency: 'USD',
      description: 'Monthly salary',
      date: new Date('2024-10-01'),
      createdAt: new Date('2024-10-01'),
      updatedAt: new Date('2024-10-01'),
    },
    {
      id: '4',
      userId: '2',
      categoryId: '3',
      type: TransactionType.EXPENSE,
      amount: 85.0,
      currency: 'USD',
      description: 'Movie tickets and popcorn',
      date: new Date('2024-10-18'),
      createdAt: new Date('2024-10-18'),
      updatedAt: new Date('2024-10-18'),
    },
    {
      id: '5',
      userId: '1',
      categoryId: '4',
      type: TransactionType.EXPENSE,
      amount: 200.0,
      currency: 'USD',
      description: 'Electricity bill',
      date: new Date('2024-10-10'),
      createdAt: new Date('2024-10-10'),
      updatedAt: new Date('2024-10-10'),
    },
  ];

  findAll(): Transaction[] {
    return this.transactions;
  }

  findById(id: string): Transaction | undefined {
    return this.transactions.find((tx) => tx.id === id);
  }

  findByUserId(userId: string): Transaction[] {
    return this.transactions.filter((tx) => tx.userId === userId);
  }

  findByCategoryId(categoryId: string): Transaction[] {
    return this.transactions.filter((tx) => tx.categoryId === categoryId);
  }

  findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Transaction[] {
    return this.transactions.filter(
      (tx) =>
        tx.userId === userId && tx.date >= startDate && tx.date <= endDate,
    );
  }

  findByType(userId: string, type: TransactionType): Transaction[] {
    return this.transactions.filter(
      (tx) => tx.userId === userId && tx.type === type,
    );
  }

  create(txData: {
    userId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    currency: string;
    description: string;
    date: Date;
  }): Transaction {
    const newTransaction: Transaction = {
      ...txData,
      id: (this.transactions.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  update(id: string, txData: Partial<Transaction>): Transaction | undefined {
    const txIndex = this.transactions.findIndex((tx) => tx.id === id);
    if (txIndex === -1) return undefined;

    this.transactions[txIndex] = {
      ...this.transactions[txIndex],
      ...txData,
      updatedAt: new Date(),
    };
    return this.transactions[txIndex];
  }

  delete(id: string): boolean {
    const txIndex = this.transactions.findIndex((tx) => tx.id === id);
    if (txIndex === -1) return false;

    this.transactions.splice(txIndex, 1);
    return true;
  }
}
