import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../../domain/enums/category-type.enum';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsEnum(CategoryType, { message: 'Invalid category type' })
  type?: CategoryType;

  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color?: string;

  @IsOptional()
  @IsString({ message: 'Icon must be a string' })
  icon?: string;
}
