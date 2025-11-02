import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class TransactionResponseDto {
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
}
