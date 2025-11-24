import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from './transaction.repository';
import { PrismaService } from '../../../database/prisma.service';
import {
  prismaMock,
  resetPrismaMock,
} from '../../../../test/utils/prisma-mock';
import { Transaction, TransactionType, Prisma } from '@prisma/client';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;

  const mockTransaction: Transaction = {
    id: '1',
    userId: 'user1',
    categoryId: 'cat1',
    type: TransactionType.EXPENSE,
    amount: new Prisma.Decimal(50.0),
    currency: 'USD',
    description: 'Lunch at restaurant',
    date: new Date('2024-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    resetPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return transaction when found', async () => {
      prismaMock.transaction.findUnique.mockResolvedValue(mockTransaction);

      const result = await repository.findById('1');

      expect(prismaMock.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockTransaction);
    });

    it('should return null when transaction not found', async () => {
      prismaMock.transaction.findUnique.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return transactions for user', async () => {
      const transactions = [mockTransaction];
      prismaMock.transaction.findMany.mockResolvedValue(transactions);

      const result = await repository.findByUserId('user1');

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
      });
      expect(result).toEqual(transactions);
    });
  });

  describe('findByCategoryId', () => {
    it('should return transactions for category', async () => {
      const transactions = [mockTransaction];
      prismaMock.transaction.findMany.mockResolvedValue(transactions);

      const result = await repository.findByCategoryId('cat1');

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith({
        where: { categoryId: 'cat1' },
      });
      expect(result).toEqual(transactions);
    });
  });

  describe('findByDateRange', () => {
    it('should return transactions within date range', async () => {
      const transactions = [mockTransaction];
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      prismaMock.transaction.findMany.mockResolvedValue(transactions);

      const result = await repository.findByDateRange(
        'user1',
        startDate,
        endDate,
      );

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      expect(result).toEqual(transactions);
    });
  });

  describe('findByType', () => {
    it('should return transactions by type', async () => {
      const transactions = [mockTransaction];
      prismaMock.transaction.findMany.mockResolvedValue(transactions);

      const result = await repository.findByType(
        'user1',
        TransactionType.EXPENSE,
      );

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          type: TransactionType.EXPENSE,
        },
      });
      expect(result).toEqual(transactions);
    });
  });

  describe('create', () => {
    it('should create and return new transaction', async () => {
      const txData = {
        userId: 'user1',
        categoryId: 'cat1',
        type: TransactionType.INCOME,
        amount: 1000.0,
        currency: 'EUR',
        description: 'Salary payment',
        date: new Date('2024-01-01'),
      };

      const createdTransaction = {
        ...txData,
        amount: new Prisma.Decimal(txData.amount),
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.transaction.create.mockResolvedValue(createdTransaction);

      const result = await repository.create(txData);

      expect(prismaMock.transaction.create).toHaveBeenCalledWith({
        data: {
          userId: txData.userId,
          categoryId: txData.categoryId,
          type: txData.type,
          amount: txData.amount,
          currency: txData.currency,
          description: txData.description,
          date: txData.date,
        },
      });
      expect(result).toEqual(createdTransaction);
    });

    it('should set default currency to USD when not provided', async () => {
      const txData = {
        userId: 'user1',
        categoryId: 'cat1',
        type: TransactionType.EXPENSE,
        amount: 25.5,
        description: 'Coffee',
        date: new Date('2024-01-15'),
      };

      const createdTransaction = {
        ...txData,
        amount: new Prisma.Decimal(txData.amount),
        currency: 'USD',
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.transaction.create.mockResolvedValue(createdTransaction);

      await repository.create(txData);

      expect(prismaMock.transaction.create).toHaveBeenCalledWith({
        data: {
          userId: txData.userId,
          categoryId: txData.categoryId,
          type: txData.type,
          amount: txData.amount,
          currency: 'USD',
          description: txData.description,
          date: txData.date,
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return transaction', async () => {
      const updateData = {
        amount: new Prisma.Decimal(75.0),
        description: 'Updated lunch',
      };

      const updatedTransaction = {
        ...mockTransaction,
        amount: updateData.amount,
        description: updateData.description,
        updatedAt: new Date(),
      };

      prismaMock.transaction.update.mockResolvedValue(updatedTransaction);

      const result = await repository.update('1', updateData);

      expect(prismaMock.transaction.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          amount: new Prisma.Decimal(75.0),
          description: 'Updated lunch',
          updatedAt: expect.anything(),
        },
      });
      expect(result).toEqual(updatedTransaction);
    });

    it('should handle partial updates with null description', async () => {
      const updateData = {
        description: null,
      };

      const updatedTransaction = {
        ...mockTransaction,
        description: null,
        updatedAt: new Date(),
      };

      prismaMock.transaction.update.mockResolvedValue(updatedTransaction);

      const result = await repository.update('1', updateData);

      expect(prismaMock.transaction.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          description: null,
          updatedAt: expect.anything(),
        },
      });
      expect(result).toEqual(updatedTransaction);

      prismaMock.transaction.update.mockResolvedValue(updatedTransaction);

      await repository.update('1', updateData);

      expect(prismaMock.transaction.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          description: null,
          updatedAt: expect.anything(),
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete transaction and return true', async () => {
      prismaMock.transaction.delete.mockResolvedValue(mockTransaction);

      const result = await repository.delete('1');

      expect(prismaMock.transaction.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });

    it('should return false when deletion fails', async () => {
      prismaMock.transaction.delete.mockRejectedValue(new Error('Not found'));

      const result = await repository.delete('1');

      expect(result).toBe(false);
    });
  });
});
