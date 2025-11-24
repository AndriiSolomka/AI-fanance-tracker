import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from './category.repository';
import { PrismaService } from '../../../database/prisma.service';
import {
  prismaMock,
  resetPrismaMock,
} from '../../../../test/utils/prisma-mock';
import { Category, CategoryType } from '@prisma/client';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;

  const mockCategory: Category = {
    id: '1',
    userId: 'user1',
    name: 'Food',
    type: CategoryType.FOOD,
    color: '#FF0000',
    icon: '🍕',
    isDefault: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    resetPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of categories', async () => {
      const categories = [mockCategory];
      prismaMock.category.findMany.mockResolvedValue(categories);

      const result = await repository.findAll();

      expect(prismaMock.category.findMany).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe('findById', () => {
    it('should return category when found', async () => {
      prismaMock.category.findUnique.mockResolvedValue(mockCategory);

      const result = await repository.findById('1');

      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockCategory);
    });

    it('should return null when category not found', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return categories for user and default categories', async () => {
      const categories = [mockCategory];
      prismaMock.category.findMany.mockResolvedValue(categories);

      const result = await repository.findByUserId('user1');

      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ userId: 'user1' }, { isDefault: true }],
        },
      });
      expect(result).toEqual(categories);
    });
  });

  describe('findByType', () => {
    it('should return categories by type', async () => {
      const categories = [mockCategory];
      prismaMock.category.findMany.mockResolvedValue(categories);

      const result = await repository.findByType(CategoryType.FOOD);

      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        where: { type: CategoryType.FOOD },
      });
      expect(result).toEqual(categories);
    });
  });

  describe('create', () => {
    it('should create and return new category', async () => {
      const categoryData = {
        userId: 'user1',
        name: 'Transportation',
        type: CategoryType.TRANSPORT,
        color: '#00FF00',
        icon: '🚗',
        isDefault: false,
      };

      const createdCategory = {
        ...categoryData,
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.create.mockResolvedValue(createdCategory);

      const result = await repository.create(categoryData);

      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: {
          userId: categoryData.userId,
          name: categoryData.name,
          type: categoryData.type,
          color: categoryData.color,
          icon: categoryData.icon,
          isDefault: categoryData.isDefault,
        },
      });
      expect(result).toEqual(createdCategory);
    });

    it('should set isDefault to false by default', async () => {
      const categoryData = {
        userId: 'user1',
        name: 'Entertainment',
        type: CategoryType.ENTERTAINMENT,
        color: '#0000FF',
        icon: '🎬',
      };

      const createdCategory = {
        ...categoryData,
        isDefault: false,
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.create.mockResolvedValue(createdCategory);

      await repository.create(categoryData);

      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: {
          userId: categoryData.userId,
          name: categoryData.name,
          type: categoryData.type,
          color: categoryData.color,
          icon: categoryData.icon,
          isDefault: false,
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return category', async () => {
      const updateData = {
        name: 'Updated Food',
        color: '#FF9900',
      };

      const updatedCategory = {
        ...mockCategory,
        ...updateData,
      };

      prismaMock.category.update.mockResolvedValue(updatedCategory);

      const result = await repository.update('1', updateData);

      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Updated Food',
          color: '#FF9900',
        },
      });
      expect(result).toEqual(updatedCategory);
    });

    it('should handle partial updates with boolean field', async () => {
      const updateData = {
        isDefault: true,
      };

      const updatedCategory = {
        ...mockCategory,
        isDefault: true,
      };

      prismaMock.category.update.mockResolvedValue(updatedCategory);

      await repository.update('1', updateData);

      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          isDefault: true,
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete category and return true', async () => {
      prismaMock.category.delete.mockResolvedValue(mockCategory);

      const result = await repository.delete('1');

      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });

    it('should return false when deletion fails', async () => {
      prismaMock.category.delete.mockRejectedValue(new Error('Not found'));

      const result = await repository.delete('1');

      expect(result).toBe(false);
    });
  });
});
