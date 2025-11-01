import { CategoryType } from '../../domain/enums/category-type.enum';

export class UpdateCategoryDto {
  name?: string;
  type?: CategoryType;
  color?: string;
  icon?: string;
}
