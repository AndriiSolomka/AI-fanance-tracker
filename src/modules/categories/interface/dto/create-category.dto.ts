import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  userId: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
}
