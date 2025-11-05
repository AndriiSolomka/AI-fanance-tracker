import { User } from '../domain/entities/user.entity';

export const usersMock: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    passwordHash: 'hashed_password_123',
    firstName: 'John',
    lastName: 'Doe',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'jane@example.com',
    passwordHash: 'hashed_password_456',
    firstName: 'Jane',
    lastName: 'Smith',
    isEmailVerified: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];
