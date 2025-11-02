import { CategoryType } from '../enums/category-type.enum';

export type Category = {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: Date;
};
