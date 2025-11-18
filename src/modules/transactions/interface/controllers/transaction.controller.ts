import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TransactionService } from '../../application/services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getAllTransactions() {
    // return this.transactionService.getAllTransactions();
  }

  @Get('user/:userId')
  getTransactionsByUserId(@Param('userId') userId: string) {
    return this.transactionService.getTransactionsByUserId(userId);
  }

  @Get('user/:userId/type/:type')
  getTransactionsByType(
    @Param('userId') userId: string,
    @Param('type') type: TransactionType,
  ) {
    return this.transactionService.getTransactionsByType(userId, type);
  }

  @Get('category/:categoryId')
  getTransactionsByCategoryId(@Param('categoryId') categoryId: string) {
    return this.transactionService.getTransactionsByCategoryId(categoryId);
  }

  @Get('stats/:userId')
  getUserStats(@Param('userId') userId: string) {
    return {
      totalIncome: this.transactionService.calculateTotalIncome(userId),
      totalExpenses: this.transactionService.calculateTotalExpenses(userId),
      balance: this.transactionService.calculateBalance(userId),
    };
  }

  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    return this.transactionService.getTransactionById(id);
  }

  @Post()
  createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionService.createTransaction(
      dto.userId,
      dto.categoryId,
      dto.type,
      dto.amount,
      dto.currency,
      dto.description,
      new Date(dto.date),
    );
  }

  @Put(':id')
  updateTransaction(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionService.updateTransaction(id, {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
      amount: dto.amount !== undefined ? new Decimal(dto.amount) : undefined,
    });
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    await this.transactionService.deleteTransaction(id);
    return { message: 'Transaction deleted successfully' };
  }
}
