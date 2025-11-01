import { Module } from '@nestjs/common';
import { CategoryController } from './interface/controllers/category.controller';
import { CategoryService } from './application/services/category.service';
import { CategoryRepository } from './application/repositories/category.repository';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoriesModule {}
