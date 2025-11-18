import { TransactionType } from '@prisma/client';

export class UpdateTransactionDto {
  categoryId?: string;
  type?: TransactionType;
  amount?: number;
  currency?: string;
  description?: string;
  date?: string; // ISO date string
}
