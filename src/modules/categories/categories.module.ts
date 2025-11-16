import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CategoryController } from './interface/controllers/category.controller';
import { CategoryService } from './application/services/category.service';
import { CategoryRepository } from './application/repositories/category.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoriesModule {}
