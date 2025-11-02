import { CategoryType } from '../../domain/enums/category-type.enum';

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
