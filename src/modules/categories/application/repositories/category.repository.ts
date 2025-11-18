import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CategoryType } from '../../domain/enums/category-type.enum';
import { Category } from '../../domain/entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();
    return categories.map((cat) => ({
      id: cat.id,
      userId: cat.userId,
      name: cat.name,
      type: cat.type as CategoryType,
      color: cat.color,
      icon: cat.icon,
      isDefault: cat.isDefault,
      createdAt: cat.createdAt,
    }));
  }

  async findById(id: string): Promise<Category | null> {
    const cat = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!cat) return null;

    return {
      id: cat.id,
      userId: cat.userId,
      name: cat.name,
      type: cat.type as CategoryType,
      color: cat.color,
      icon: cat.icon,
      isDefault: cat.isDefault,
      createdAt: cat.createdAt,
    };
  }

  async findByUserId(userId: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        OR: [{ userId }, { isDefault: true }],
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      userId: cat.userId,
      name: cat.name,
      type: cat.type as CategoryType,
      color: cat.color,
      icon: cat.icon,
      isDefault: cat.isDefault,
      createdAt: cat.createdAt,
    }));
  }

  async findByType(type: CategoryType): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { type: type as any },
    });

    return categories.map((cat) => ({
      id: cat.id,
      userId: cat.userId,
      name: cat.name,
      type: cat.type as CategoryType,
      color: cat.color,
      icon: cat.icon,
      isDefault: cat.isDefault,
      createdAt: cat.createdAt,
    }));
  }

  async create(categoryData: {
    userId: string;
    name: string;
    type: CategoryType;
    color: string;
    icon: string;
    isDefault?: boolean;
  }): Promise<Category> {
    const { userId, name, type, color, icon, isDefault } = categoryData;

    const cat = await this.prisma.category.create({
      data: {
        userId,
        name,
        type: type as any,
        color,
        icon,
        isDefault: isDefault ?? false,
      },
    });

    return {
      id: cat.id,
      userId: cat.userId,
      name: cat.name,
      type: cat.type as CategoryType,
      color: cat.color,
      icon: cat.icon,
      isDefault: cat.isDefault,
      createdAt: cat.createdAt,
    };
  }

  async update(
    id: string,
    categoryData: Partial<Category>,
  ): Promise<Category | null> {
    try {
      const cat = await this.prisma.category.update({
        where: { id },
        data: {
          ...(categoryData.name && { name: categoryData.name }),
          ...(categoryData.type && { type: categoryData.type as any }),
          ...(categoryData.color && { color: categoryData.color }),
          ...(categoryData.icon && { icon: categoryData.icon }),
          ...(categoryData.isDefault !== undefined && {
            isDefault: categoryData.isDefault,
          }),
        },
      });

      return {
        id: cat.id,
        userId: cat.userId,
        name: cat.name,
        type: cat.type as CategoryType,
        color: cat.color,
        icon: cat.icon,
        isDefault: cat.isDefault,
        createdAt: cat.createdAt,
      };
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
