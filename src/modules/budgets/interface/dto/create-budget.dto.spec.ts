import { validate } from 'class-validator';
import { CreateBudgetDto } from './create-budget.dto';
import { BudgetPeriod } from '@prisma/client';

describe('CreateBudgetDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = 1000;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = '2024-01-31T23:59:59.999Z';
    dto.alertThreshold = 0.8;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid userId', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = 'invalid-uuid';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = 1000;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = '2024-01-31T23:59:59.999Z';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation with empty userId', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = 1000;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = '2024-01-31T23:59:59.999Z';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with invalid categoryId', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.categoryId = 'invalid-uuid';
    dto.limitAmount = 1000;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = '2024-01-31T23:59:59.999Z';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should fail validation with negative limitAmount', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = -100;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = '2024-01-31T23:59:59.999Z';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should fail validation with zero limitAmount', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = 0;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = '2024-01-31T23:59:59.999Z';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should fail validation with invalid period', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = 1000;
    dto.limitCurrency = 'USD';
    (dto as any).period = 'INVALID_PERIOD';
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = '2024-01-31T23:59:59.999Z';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should fail validation with invalid startDate', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = 1000;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = 'invalid-date';
    dto.endDate = '2024-01-31T23:59:59.999Z';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should fail validation with invalid endDate', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = 1000;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = 'invalid-date';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should fail validation with alertThreshold greater than 1', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = 1000;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = '2024-01-31T23:59:59.999Z';
    dto.alertThreshold = 1.5;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('should fail validation with negative alertThreshold', async () => {
    const dto = new CreateBudgetDto();
    dto.userId = '550e8400-e29b-41d4-a716-446655440000';
    dto.categoryId = '550e8400-e29b-41d4-a716-446655440001';
    dto.limitAmount = 1000;
    dto.limitCurrency = 'USD';
    dto.period = BudgetPeriod.MONTHLY;
    dto.startDate = '2024-01-01T00:00:00.000Z';
    dto.endDate = '2024-01-31T23:59:59.999Z';
    dto.alertThreshold = -0.1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });
});
