import { TransactionType } from '../enums/transaction-type.enum';

export interface CreateTransactionInput {
  userId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  date: Date;
}
