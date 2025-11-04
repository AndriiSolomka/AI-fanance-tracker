import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BudgetService } from '../../application/services/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { BudgetStatus } from '../../domain/enums/budget-status.enum';

@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  getAllBudgets() {
    return this.budgetService.getAllBudgets();
  }

  @Get('user/:userId')
  getBudgetsByUserId(@Param('userId') userId: string) {
    return this.budgetService.getBudgetsByUserId(userId);
  }

  @Get('user/:userId/status/:status')
  getBudgetsByUserAndStatus(
    @Param('userId') userId: string,
    @Param('status') status: BudgetStatus,
  ) {
    return this.budgetService.getBudgetsByStatus(userId, status);
  }

  @Get('category/:categoryId')
  getBudgetsByCategoryId(@Param('categoryId') categoryId: string) {
    return this.budgetService.getBudgetsByCategoryId(categoryId);
  }

  @Get(':id')
  getBudgetById(@Param('id') id: string) {
    return this.budgetService.getBudgetById(id);
  }

  @Get(':id/stats')
  getBudgetStats(@Param('id') id: string) {
    return this.budgetService.getBudgetStats(id);
  }

  @Post()
  createBudget(@Body() dto: CreateBudgetDto) {
    const {
      userId,
      categoryId,
      limitAmount,
      limitCurrency,
      period,
      startDate,
      endDate,
      alertThreshold,
    } = dto;

    return this.budgetService.createBudget(
      userId,
      categoryId,
      limitAmount,
      limitCurrency,
      period,
      new Date(startDate),
      new Date(endDate),
      alertThreshold,
    );
  }

  @Put(':id')
  updateBudget(@Param('id') id: string, @Body() dto: UpdateBudgetDto) {
    const updateData = {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };
    return this.budgetService.updateBudget(id, updateData);
  }

  @Delete(':id')
  deleteBudget(@Param('id') id: string) {
    this.budgetService.deleteBudget(id);
    return { message: 'Budget deleted successfully' };
  }

  @Post('check')
  checkBudget(
    @Body() dto: { userId: string; categoryId: string; amount: number },
  ) {
    const { userId, categoryId, amount } = dto;
    return this.budgetService.checkBudget(userId, categoryId, amount);
  }
}
