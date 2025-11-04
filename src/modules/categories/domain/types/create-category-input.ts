import { CategoryType } from '../enums/category-type.enum';

export interface CreateCategoryInput {
  userId: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  isDefault: boolean;
}
