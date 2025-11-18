import { CategoryType } from '@prisma/client';

export class CategoryResponseDto {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: Date;
}
