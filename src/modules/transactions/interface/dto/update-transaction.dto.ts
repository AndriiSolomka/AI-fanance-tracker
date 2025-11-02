import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class UpdateTransactionDto {
  categoryId?: string;
  type?: TransactionType;
  amount?: number;
  currency?: string;
  description?: string;
  date?: string; // ISO date string
}
