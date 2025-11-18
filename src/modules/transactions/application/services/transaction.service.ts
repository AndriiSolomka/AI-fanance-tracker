import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  // async getAllTransactions(): Promise<Transaction[]> {
  //   // return await this.transactionRepository.findAll();
  // }

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }

  async getTransactionsByCategoryId(
    categoryId: string,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByCategoryId(categoryId);
  }

  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByDateRange(
      userId,
      startDate,
      endDate,
    );
  }

  async getTransactionsByType(
    userId: string,
    type: TransactionType,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByType(userId, type);
  }

  async createTransaction(
    userId: string,
    categoryId: string,
    type: TransactionType,
    amount: number,
    currency: string,
    description: string,
    date: Date,
  ): Promise<Transaction> {
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

  async updateTransaction(
    id: string,
    updateData: Partial<Transaction>,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.update(id, updateData);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    const deleted = await this.transactionRepository.delete(id);
    if (!deleted) {
      throw new Error('Transaction not found');
    }
  }

  async calculateTotalIncome(userId: string): Promise<number> {
    const transactions = await this.transactionRepository.findByType(
      userId,
      TransactionType.INCOME,
    );
    return transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  }

  async calculateTotalExpenses(userId: string): Promise<number> {
    const transactions = await this.transactionRepository.findByType(
      userId,
      TransactionType.EXPENSE,
    );
    return transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  }

  async calculateBalance(userId: string): Promise<number> {
    const [income, expenses] = await Promise.all([
      this.calculateTotalIncome(userId),
      this.calculateTotalExpenses(userId),
    ]);
    return income - expenses;
  }
}
