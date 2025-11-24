import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { BudgetPeriod } from '@prisma/client';

export class CreateBudgetDto {
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string;

  @IsNumber({}, { message: 'Limit amount must be a number' })
  @IsPositive({ message: 'Limit amount must be positive' })
  @IsNotEmpty({ message: 'Limit amount is required' })
  limitAmount: number;

  @IsString({ message: 'Limit currency must be a string' })
  @IsNotEmpty({ message: 'Limit currency is required' })
  limitCurrency: string;

  @IsEnum(BudgetPeriod, { message: 'Invalid budget period' })
  @IsNotEmpty({ message: 'Period is required' })
  period: BudgetPeriod;

  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  @IsNotEmpty({ message: 'End date is required' })
  endDate: string;

  @IsOptional()
  @IsNumber({}, { message: 'Alert threshold must be a number' })
  @Min(0, { message: 'Alert threshold must be at least 0' })
  @Max(1, { message: 'Alert threshold must not exceed 1' })
  alertThreshold?: number;
}
