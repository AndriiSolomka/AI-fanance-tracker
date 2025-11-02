import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository {
  private users = new Map<string, User>();
  private emailIndex = new Map<string, string>();
  private idCounter = 3;

  constructor() {
    // Initial data
    const user1: User = {
      id: '1',
      email: 'john@example.com',
      passwordHash: 'hashed_password_123',
      firstName: 'John',
      lastName: 'Doe',
      isEmailVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };
    const user2: User = {
      id: '2',
      email: 'jane@example.com',
      passwordHash: 'hashed_password_456',
      firstName: 'Jane',
      lastName: 'Smith',
      isEmailVerified: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    };

    this.users.set('1', user1);
    this.users.set('2', user2);
    this.emailIndex.set('john@example.com', '1');
    this.emailIndex.set('jane@example.com', '2');
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  findByEmail(email: string): User | undefined {
    const userId = this.emailIndex.get(email);
    if (!userId) return undefined;
    return this.users.get(userId);
  }

  create(userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
  }): User {
    const id = (this.idCounter++).toString();
    const newUser: User = {
      ...userData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    this.emailIndex.set(userData.email, id);
    return newUser;
  }

  update(id: string, userData: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);

    if (userData.email && userData.email !== user.email) {
      this.emailIndex.delete(user.email);
      this.emailIndex.set(userData.email, id);
    }

    return updatedUser;
  }

  delete(id: string): boolean {
    const user = this.users.get(id);
    if (!user) return false;

    this.emailIndex.delete(user.email);
    this.users.delete(id);
    return true;
  }
}
