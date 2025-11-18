import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CategoryType } from '../../domain/enums/category-type.enum';

export class CreateCategoryDto {
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEnum(CategoryType, { message: 'Invalid category type' })
  @IsNotEmpty({ message: 'Type is required' })
  type: CategoryType;

  @IsString({ message: 'Color must be a string' })
  @IsNotEmpty({ message: 'Color is required' })
  color: string;

  @IsString({ message: 'Icon must be a string' })
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;
}
