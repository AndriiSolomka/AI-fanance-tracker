import { Test, TestingModule } from '@nestjs/testing';
import { BudgetRepository } from './budget.repository';
import { PrismaService } from '../../../database/prisma.service';
import {
  prismaMock,
  resetPrismaMock,
} from '../../../../test/utils/prisma-mock';
import { Budget, BudgetPeriod, BudgetStatus, Prisma } from '@prisma/client';

describe('BudgetRepository', () => {
  let repository: BudgetRepository;

  const mockBudget: Budget = {
    id: '1',
    userId: 'user1',
    categoryId: 'cat1',
    limitAmount: new Prisma.Decimal(1000),
    limitCurrency: 'USD',
    spentAmount: new Prisma.Decimal(500),
    period: BudgetPeriod.MONTHLY,
    status: BudgetStatus.ACTIVE,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    alertThreshold: new Prisma.Decimal(0.8),
    createdAt: new Date(),
  };

  beforeEach(async () => {
    resetPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<BudgetRepository>(BudgetRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of budgets', async () => {
      const budgets = [mockBudget];
      prismaMock.budget.findMany.mockResolvedValue(budgets);

      const result = await repository.findAll();

      expect(prismaMock.budget.findMany).toHaveBeenCalled();
      expect(result).toEqual(budgets);
    });
  });

  describe('findById', () => {
    it('should return budget when found', async () => {
      prismaMock.budget.findUnique.mockResolvedValue(mockBudget);

      const result = await repository.findById('1');

      expect(prismaMock.budget.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockBudget);
    });

    it('should return null when budget not found', async () => {
      prismaMock.budget.findUnique.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return budgets for user', async () => {
      const budgets = [mockBudget];
      prismaMock.budget.findMany.mockResolvedValue(budgets);

      const result = await repository.findByUserId('user1');

      expect(prismaMock.budget.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
      });
      expect(result).toEqual(budgets);
    });
  });

  describe('findByCategoryId', () => {
    it('should return budgets for category', async () => {
      const budgets = [mockBudget];
      prismaMock.budget.findMany.mockResolvedValue(budgets);

      const result = await repository.findByCategoryId('cat1');

      expect(prismaMock.budget.findMany).toHaveBeenCalledWith({
        where: { categoryId: 'cat1' },
      });
      expect(result).toEqual(budgets);
    });
  });

  describe('findActiveByCategory', () => {
    it('should return active budget for user and category', async () => {
      prismaMock.budget.findFirst.mockResolvedValue(mockBudget);

      const result = await repository.findActiveByCategory('user1', 'cat1');

      expect(prismaMock.budget.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          categoryId: 'cat1',
          status: BudgetStatus.ACTIVE,
        },
      });
      expect(result).toEqual(mockBudget);
    });

    it('should return null when no active budget found', async () => {
      prismaMock.budget.findFirst.mockResolvedValue(null);

      const result = await repository.findActiveByCategory('user1', 'cat1');

      expect(result).toBeNull();
    });
  });

  describe('findByStatus', () => {
    it('should return budgets by status', async () => {
      const budgets = [mockBudget];
      prismaMock.budget.findMany.mockResolvedValue(budgets);

      const result = await repository.findByStatus(
        'user1',
        BudgetStatus.ACTIVE,
      );

      expect(prismaMock.budget.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          status: BudgetStatus.ACTIVE,
        },
      });
      expect(result).toEqual(budgets);
    });
  });

  describe('create', () => {
    it('should create and return new budget', async () => {
      const budgetData = {
        userId: 'user1',
        categoryId: 'cat1',
        limitAmount: 2000,
        limitCurrency: 'EUR',
        spentAmount: 100,
        period: BudgetPeriod.WEEKLY,
        status: BudgetStatus.CREATED,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-07'),
        alertThreshold: 0.9,
      };

      const createdBudget = {
        ...budgetData,
        id: '2',
        limitAmount: new Prisma.Decimal(budgetData.limitAmount),
        spentAmount: new Prisma.Decimal(budgetData.spentAmount || 0),
        alertThreshold: new Prisma.Decimal(budgetData.alertThreshold || 0.8),
        createdAt: new Date(),
      };

      prismaMock.budget.create.mockResolvedValue(createdBudget);

      const result = await repository.create(budgetData);

      expect(prismaMock.budget.create).toHaveBeenCalledWith({
        data: {
          userId: budgetData.userId,
          categoryId: budgetData.categoryId,
          limitAmount: budgetData.limitAmount,
          limitCurrency: budgetData.limitCurrency,
          spentAmount: budgetData.spentAmount,
          period: budgetData.period,
          status: budgetData.status,
          startDate: budgetData.startDate,
          endDate: budgetData.endDate,
          alertThreshold: budgetData.alertThreshold,
        },
      });
      expect(result).toEqual(createdBudget);
    });

    it('should set default values when not provided', async () => {
      const budgetData = {
        userId: 'user1',
        categoryId: 'cat1',
        limitAmount: 1500,
        period: BudgetPeriod.MONTHLY,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const createdBudget = {
        ...budgetData,
        limitCurrency: 'USD',
        spentAmount: new Prisma.Decimal(0),
        status: BudgetStatus.CREATED,
        alertThreshold: new Prisma.Decimal(0.8),
        id: '2',
        createdAt: new Date(),
      };

      prismaMock.budget.create.mockResolvedValue(createdBudget);

      await repository.create(budgetData);

      expect(prismaMock.budget.create).toHaveBeenCalledWith({
        data: {
          userId: budgetData.userId,
          categoryId: budgetData.categoryId,
          limitAmount: budgetData.limitAmount,
          limitCurrency: 'USD',
          spentAmount: 0,
          period: budgetData.period,
          status: BudgetStatus.CREATED,
          startDate: budgetData.startDate,
          endDate: budgetData.endDate,
          alertThreshold: 0.8,
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return budget', async () => {
      const updateData = {
        limitAmount: 1500,
        spentAmount: 750,
        status: BudgetStatus.ACTIVE,
      };

      const updatedBudget = {
        ...mockBudget,
        limitAmount: new Prisma.Decimal(updateData.limitAmount),
        spentAmount: new Prisma.Decimal(updateData.spentAmount),
        status: updateData.status,
      };

      prismaMock.budget.update.mockResolvedValue(updatedBudget);

      const result = await repository.update('1', updateData);

      expect(prismaMock.budget.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          limitAmount: 1500,
          spentAmount: 750,
          status: BudgetStatus.ACTIVE,
        },
      });
      expect(result).toEqual(updatedBudget);
    });

    it('should handle partial updates', async () => {
      const updateData = {
        alertThreshold: 0.7,
      };

      const updatedBudget = {
        ...mockBudget,
        alertThreshold: new Prisma.Decimal(0.7),
      };

      prismaMock.budget.update.mockResolvedValue(updatedBudget);

      await repository.update('1', updateData);

      expect(prismaMock.budget.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          alertThreshold: 0.7,
        },
      });
    });
  });

  describe('updateSpent', () => {
    it('should update spent amount using update method', async () => {
      const updatedBudget = {
        ...mockBudget,
        spentAmount: new Prisma.Decimal(600),
      };

      prismaMock.budget.update.mockResolvedValue(updatedBudget);

      const result = await repository.updateSpent('1', 600);

      expect(prismaMock.budget.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          spentAmount: 600,
        },
      });
      expect(result).toEqual(updatedBudget);
    });
  });

  describe('delete', () => {
    it('should delete budget and return true', async () => {
      prismaMock.budget.delete.mockResolvedValue(mockBudget);

      const result = await repository.delete('1');

      expect(prismaMock.budget.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });
  });
});
