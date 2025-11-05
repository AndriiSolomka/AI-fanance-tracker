import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { usersMock } from '../../constants/users.mock';
import { CreateUserInput } from '../../domain/entities/types/create-user-input.type';

@Injectable()
export class UserRepository {
  private users = new Map<string, User>();
  private emailIndex = new Map<string, string>();
  private idCounter = 3;

  constructor() {
    usersMock.forEach((user) => {
      this.users.set(user.id, user);
      this.emailIndex.set(user.email, user.id);
    });
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

  create(userData: CreateUserInput): User {
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
