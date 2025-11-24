import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { Category, CategoryType } from '@prisma/client';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: jest.Mocked<CategoryRepository>;

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
    const mockCategoryRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByType: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = [mockCategory];
      categoryRepository.findAll.mockResolvedValue(categories);

      const result = await service.getAllCategories();

      expect(categoryRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe('getCategoryById', () => {
    it('should return category when found', async () => {
      categoryRepository.findById.mockResolvedValue(mockCategory);

      const result = await service.getCategoryById('1');

      expect(categoryRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCategory);
    });

    it('should throw error when category not found', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(service.getCategoryById('1')).rejects.toThrow(
        'Category not found',
      );

      expect(categoryRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('getCategoriesByUserId', () => {
    it('should return categories for user', async () => {
      const categories = [mockCategory];
      categoryRepository.findByUserId.mockResolvedValue(categories);

      const result = await service.getCategoriesByUserId('user1');

      expect(categoryRepository.findByUserId).toHaveBeenCalledWith('user1');
      expect(result).toEqual(categories);
    });
  });

  describe('getCategoriesByType', () => {
    it('should return categories by type', async () => {
      const categories = [mockCategory];
      categoryRepository.findByType.mockResolvedValue(categories);

      const result = await service.getCategoriesByType(CategoryType.FOOD);

      expect(categoryRepository.findByType).toHaveBeenCalledWith(
        CategoryType.FOOD,
      );
      expect(result).toEqual(categories);
    });
  });

  describe('createCategory', () => {
    it('should create and return new category', async () => {
      const categoryData = {
        userId: 'user1',
        name: 'Transportation',
        type: CategoryType.TRANSPORT,
        color: '#00FF00',
        icon: '🚗',
      };

      const createdCategory = {
        ...categoryData,
        id: '2',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      categoryRepository.create.mockResolvedValue(createdCategory);

      const result = await service.createCategory(
        categoryData.userId,
        categoryData.name,
        categoryData.type,
        categoryData.color,
        categoryData.icon,
      );

      expect(categoryRepository.create).toHaveBeenCalledWith({
        userId: categoryData.userId,
        name: categoryData.name,
        type: categoryData.type,
        color: categoryData.color,
        icon: categoryData.icon,
        isDefault: false,
      });
      expect(result).toEqual(createdCategory);
    });
  });

  describe('updateCategory', () => {
    it('should update and return category', async () => {
      const updateData = {
        name: 'Updated Food',
        color: '#FF9900',
      };

      const updatedCategory = {
        ...mockCategory,
        ...updateData,
      };

      categoryRepository.update.mockResolvedValue(updatedCategory);

      const result = await service.updateCategory('1', updateData);

      expect(categoryRepository.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedCategory);
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      categoryRepository.delete.mockResolvedValue(true);

      await expect(service.deleteCategory('1')).resolves.not.toThrow();

      expect(categoryRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error when deletion fails', async () => {
      categoryRepository.delete.mockResolvedValue(false);

      await expect(service.deleteCategory('1')).rejects.toThrow(
        'Category not found',
      );

      expect(categoryRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
