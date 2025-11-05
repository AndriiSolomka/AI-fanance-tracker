import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { TRANSACTIONS_MOCK } from '../../constants/transactions.mock';
import { CreateTransactionInput } from '../../domain/types/transaction.types';

@Injectable()
export class TransactionRepository {
  private transactions = [...TRANSACTIONS_MOCK];

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

  create(txData: CreateTransactionInput): Transaction {
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
