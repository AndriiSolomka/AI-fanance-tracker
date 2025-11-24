import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return (await this.prisma.user.findMany()).map((user) => ({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    isEmailVerified?: boolean;
  }): Promise<User> {
    const { email, passwordHash, firstName, lastName, isEmailVerified } =
      userData;

    return await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        isEmailVerified: isEmailVerified ?? false,
      },
    });
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...(userData.email && { email: userData.email }),
        ...(userData.passwordHash && { passwordHash: userData.passwordHash }),
        ...(userData.firstName && { firstName: userData.firstName }),
        ...(userData.lastName && { lastName: userData.lastName }),
        ...(userData.isEmailVerified !== undefined && {
          isEmailVerified: userData.isEmailVerified,
        }),
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.user.delete({
      where: { id },
    });
    return true;
  }
}
