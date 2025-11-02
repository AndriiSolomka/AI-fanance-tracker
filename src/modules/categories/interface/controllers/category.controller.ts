import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CategoryService } from '../../application/services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryType } from '../../domain/enums/category-type.enum';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('user/:userId')
  getCategoriesByUserId(@Param('userId') userId: string) {
    return this.categoryService.getCategoriesByUserId(userId);
  }

  @Get('type/:type')
  getCategoriesByType(@Param('type') type: CategoryType) {
    return this.categoryService.getCategoriesByType(type);
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(
      dto.userId,
      dto.name,
      dto.type,
      dto.color,
      dto.icon,
    );
  }

  @Put(':id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, dto);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    this.categoryService.deleteCategory(id);
    return { message: 'Category deleted successfully' };
  }
}
