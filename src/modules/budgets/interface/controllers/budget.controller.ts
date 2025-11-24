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
import { BudgetStatus } from '@prisma/client';

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
    return this.budgetService.createBudget(
      dto.userId,
      dto.categoryId,
      dto.limitAmount,
      dto.limitCurrency,
      dto.period,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.alertThreshold,
    );
  }

  @Put(':id')
  updateBudget(@Param('id') id: string, @Body() dto: UpdateBudgetDto) {
    const updateData: any = {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.budgetService.updateBudget(id, updateData);
  }

  @Delete(':id')
  async deleteBudget(@Param('id') id: string) {
    await this.budgetService.deleteBudget(id);
    return { message: 'Budget deleted successfully' };
  }

  @Post('check')
  checkBudget(
    @Body() dto: { userId: string; categoryId: string; amount: number },
  ) {
    return this.budgetService.checkBudget(
      dto.userId,
      dto.categoryId,
      dto.amount,
    );
  }
}
