import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string;

  @IsEnum(TransactionType, { message: 'Invalid transaction type' })
  @IsNotEmpty({ message: 'Type is required' })
  type: TransactionType;

  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be positive' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsString({ message: 'Currency must be a string' })
  @IsNotEmpty({ message: 'Currency is required' })
  currency: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsDateString({}, { message: 'Date must be a valid ISO date string' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string; // ISO date string
}
