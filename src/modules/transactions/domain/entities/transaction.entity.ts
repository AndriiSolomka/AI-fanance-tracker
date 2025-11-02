import { TransactionType } from '../enums/transaction-type.enum';

export type Transaction = {
  id: string;
  userId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};
