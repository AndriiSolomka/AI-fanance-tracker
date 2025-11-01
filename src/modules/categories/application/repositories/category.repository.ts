import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { CategoryType } from '../../domain/enums/category-type.enum';

@Injectable()
export class CategoryRepository {
  private categories = new Map<string, Category>();
  private idCounter = 7;

  constructor() {
    // Initial default categories
    const cat1: Category = {
      id: '1',
      userId: 'default',
      name: 'Food & Dining',
      type: CategoryType.FOOD,
      color: '#FF6B6B',
      icon: '🍔',
      isDefault: true,
      createdAt: new Date('2024-01-01'),
    };
    const cat2: Category = {
      id: '2',
      userId: 'default',
      name: 'Transportation',
      type: CategoryType.TRANSPORT,
      color: '#4ECDC4',
      icon: '🚗',
      isDefault: true,
      createdAt: new Date('2024-01-01'),
    };
    const cat3: Category = {
      id: '3',
      userId: 'default',
      name: 'Entertainment',
      type: CategoryType.ENTERTAINMENT,
      color: '#95E1D3',
      icon: '🎬',
      isDefault: true,
      createdAt: new Date('2024-01-01'),
    };
    const cat4: Category = {
      id: '4',
      userId: 'default',
      name: 'Utilities',
      type: CategoryType.UTILITIES,
      color: '#F38181',
      icon: '💡',
      isDefault: true,
      createdAt: new Date('2024-01-01'),
    };
    const cat5: Category = {
      id: '5',
      userId: 'default',
      name: 'Salary',
      type: CategoryType.SALARY,
      color: '#6C5CE7',
      icon: '💰',
      isDefault: true,
      createdAt: new Date('2024-01-01'),
    };
    const cat6: Category = {
      id: '6',
      userId: '1',
      name: 'Gym Membership',
      type: CategoryType.HEALTH,
      color: '#A8E6CF',
      icon: '💪',
      isDefault: false,
      createdAt: new Date('2024-02-01'),
    };

    this.categories.set('1', cat1);
    this.categories.set('2', cat2);
    this.categories.set('3', cat3);
    this.categories.set('4', cat4);
    this.categories.set('5', cat5);
    this.categories.set('6', cat6);
  }

  findAll(): Category[] {
    return Array.from(this.categories.values());
  }

  findById(id: string): Category | undefined {
    return this.categories.get(id);
  }

  findByUserId(userId: string): Category[] {
    return Array.from(this.categories.values()).filter(
      (cat) => cat.isDefault || cat.userId === userId,
    );
  }

  findByType(type: CategoryType): Category[] {
    return Array.from(this.categories.values()).filter(
      (cat) => cat.type === type,
    );
  }

  create(categoryData: {
    userId: string;
    name: string;
    type: CategoryType;
    color: string;
    icon: string;
    isDefault: boolean;
  }): Category {
    const id = (this.idCounter++).toString();
    const newCategory: Category = {
      ...categoryData,
      id,
      createdAt: new Date(),
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  update(id: string, categoryData: Partial<Category>): Category | undefined {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = {
      ...category,
      ...categoryData,
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  delete(id: string): boolean {
    return this.categories.delete(id);
  }
}
