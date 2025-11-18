import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Category, CategoryType } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }

  async findById(id: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: {
        OR: [{ userId }, { isDefault: true }],
      },
    });
  }

  async findByType(type: CategoryType): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: { type: type },
    });
  }

  async create(categoryData: {
    userId: string;
    name: string;
    type: CategoryType;
    color: string;
    icon: string;
    isDefault?: boolean;
  }): Promise<Category> {
    return await this.prisma.category.create({
      data: {
        userId: categoryData.userId,
        name: categoryData.name,
        type: categoryData.type,
        color: categoryData.color,
        icon: categoryData.icon,
        isDefault: categoryData.isDefault ?? false,
      },
    });
  }

  async update(
    id: string,
    categoryData: Partial<Category>,
  ): Promise<Category | null> {
    return await this.prisma.category.update({
      where: { id },
      data: {
        ...(categoryData.name && { name: categoryData.name }),
        ...(categoryData.type && { type: categoryData.type }),
        ...(categoryData.color && { color: categoryData.color }),
        ...(categoryData.icon && { icon: categoryData.icon }),
        ...(categoryData.isDefault !== undefined && {
          isDefault: categoryData.isDefault,
        }),
      },
    });
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
