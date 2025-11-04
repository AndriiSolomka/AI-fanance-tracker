import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { CategoryType } from '../../domain/enums/category-type.enum';
import { categoriesMock } from '../../constants/categories.mock';

@Injectable()
export class CategoryRepository {
  private categories = new Map<string, Category>();
  private idCounter = 7;

  constructor() {
    categoriesMock.forEach(cat => {
      this.categories.set(cat.id, cat);
    });
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
