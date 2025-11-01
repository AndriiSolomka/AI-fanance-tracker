import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../../domain/entities/category.entity';
import { CategoryType } from '../../domain/enums/category-type.enum';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  getAllCategories(): Category[] {
    return this.categoryRepository.findAll();
  }

  getCategoryById(id: string): Category {
    const category = this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  getCategoriesByUserId(userId: string): Category[] {
    return this.categoryRepository.findByUserId(userId);
  }

  getCategoriesByType(type: CategoryType): Category[] {
    return this.categoryRepository.findByType(type);
  }

  createCategory(
    userId: string,
    name: string,
    type: CategoryType,
    color: string,
    icon: string,
  ): Category {
    return this.categoryRepository.create({
      userId,
      name,
      type,
      color,
      icon,
      isDefault: false,
    });
  }

  updateCategory(id: string, updateData: Partial<Category>): Category {
    const category = this.categoryRepository.update(id, updateData);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  deleteCategory(id: string): void {
    const deleted = this.categoryRepository.delete(id);
    if (!deleted) {
      throw new Error('Category not found');
    }
  }
}
