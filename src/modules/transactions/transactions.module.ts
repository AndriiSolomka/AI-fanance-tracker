import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TransactionController } from './interface/controllers/transaction.controller';
import { TransactionService } from './application/services/transaction.service';
import { TransactionRepository } from './application/repositories/transaction.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionsModule {}
