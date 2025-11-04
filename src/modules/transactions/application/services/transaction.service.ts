import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  getAllTransactions(): Transaction[] {
    return this.transactionRepository.findAll();
  }

  getTransactionById(id: string): Transaction {
    const transaction = this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  getTransactionsByUserId(userId: string): Transaction[] {
    return this.transactionRepository.findByUserId(userId);
  }

  getTransactionsByCategoryId(categoryId: string): Transaction[] {
    return this.transactionRepository.findByCategoryId(categoryId);
  }

  getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Transaction[] {
    return this.transactionRepository.findByDateRange(
      userId,
      startDate,
      endDate,
    );
  }

  getTransactionsByType(userId: string, type: TransactionType): Transaction[] {
    return this.transactionRepository.findByType(userId, type);
  }

  createTransaction(
    userId: string,
    categoryId: string,
    type: TransactionType,
    amount: number,
    currency: string,
    description: string,
    date: Date,
  ): Transaction {
    return this.transactionRepository.create({
      userId,
      categoryId,
      type,
      amount,
      currency,
      description,
      date,
    });
  }

  updateTransaction(id: string, updateData: Partial<Transaction>): Transaction {
    const transaction = this.transactionRepository.update(id, updateData);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  deleteTransaction(id: string): void {
    const deleted = this.transactionRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Transaction not found');
    }
  }

  calculateTotalIncome(userId: string): number {
    const transactions = this.transactionRepository.findByType(
      userId,
      TransactionType.INCOME,
    );
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }

  calculateTotalExpenses(userId: string): number {
    const transactions = this.transactionRepository.findByType(
      userId,
      TransactionType.EXPENSE,
    );
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }

  calculateBalance(userId: string): number {
    return (
      this.calculateTotalIncome(userId) - this.calculateTotalExpenses(userId)
    );
  }
}
