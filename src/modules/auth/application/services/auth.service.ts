import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return this.userRepository.create({
      email,
      passwordHash: `hashed_${password}`,
      firstName,
      lastName,
      isEmailVerified: false,
    });
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.passwordHash !== `hashed_${password}`) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
