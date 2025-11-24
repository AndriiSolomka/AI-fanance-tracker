import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { Category, CategoryType } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async getCategoriesByUserId(userId: string): Promise<Category[]> {
    return this.categoryRepository.findByUserId(userId);
  }

  async getCategoriesByType(type: CategoryType): Promise<Category[]> {
    return this.categoryRepository.findByType(type);
  }

  async createCategory(
    userId: string,
    name: string,
    type: CategoryType,
    color: string,
    icon: string,
  ): Promise<Category> {
    return this.categoryRepository.create({
      userId,
      name,
      type,
      color,
      icon,
      isDefault: false,
    });
  }

  async updateCategory(
    id: string,
    updateData: Partial<Category>,
  ): Promise<Category> {
    return await this.categoryRepository.update(id, updateData);
  }

  async deleteCategory(id: string): Promise<void> {
    const deleted = await this.categoryRepository.delete(id);

    if (!deleted) {
      throw new Error('Category not found');
    }
  }
}
