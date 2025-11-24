import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BudgetPeriod } from '@prisma/client';
import { BudgetStatus } from '@prisma/client';

export class UpdateBudgetDto {
  @IsOptional()
  @IsNumber({}, { message: 'Limit amount must be a number' })
  @IsPositive({ message: 'Limit amount must be positive' })
  limitAmount?: number;

  @IsOptional()
  @IsString({ message: 'Limit currency must be a string' })
  limitCurrency?: string;

  @IsOptional()
  @IsEnum(BudgetPeriod, { message: 'Invalid budget period' })
  period?: BudgetPeriod;

  @IsOptional()
  @IsEnum(BudgetStatus, { message: 'Invalid budget status' })
  status?: BudgetStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  endDate?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Alert threshold must be a number' })
  @Min(0, { message: 'Alert threshold must be at least 0' })
  @Max(1, { message: 'Alert threshold must not exceed 1' })
  alertThreshold?: number;
}
