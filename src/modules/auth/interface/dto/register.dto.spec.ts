import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = new RegisterDto();
    dto.email = 'invalid-email';
    dto.password = 'password123';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with empty email', async () => {
    const dto = new RegisterDto();
    dto.email = '';
    dto.password = 'password123';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with short password', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = '12345';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail validation with empty password', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = '';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with empty firstName', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';
    dto.firstName = '';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation with empty lastName', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';
    dto.firstName = 'John';
    dto.lastName = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
