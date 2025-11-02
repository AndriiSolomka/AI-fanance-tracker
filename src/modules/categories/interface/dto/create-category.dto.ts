import { CategoryType } from '../../domain/enums/category-type.enum';

export class CreateCategoryDto {
  userId: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
}
