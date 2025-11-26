import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '../../../database/prisma.service';
import {
  prismaMock,
  resetPrismaMock,
} from '../../../../test/utils/prisma-mock';
import { User } from '@prisma/client';

describe('UserRepository', () => {
  let repository: UserRepository;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    firstName: 'John',
    lastName: 'Doe',
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    resetPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const users = [mockUser];
      prismaMock.user.findMany.mockResolvedValue(users);

      const result = await repository.findAll();

      expect(prismaMock.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: mockUser.id,
          email: mockUser.email,
          passwordHash: mockUser.passwordHash,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          isEmailVerified: mockUser.isEmailVerified,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
      ]);
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findById('1');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return new user', async () => {
      const userData = {
        email: 'new@example.com',
        passwordHash: 'hashed_password',
        firstName: 'Jane',
        lastName: 'Smith',
        isEmailVerified: true,
      };

      const createdUser = {
        ...userData,
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(createdUser);

      const result = await repository.create(userData);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          passwordHash: userData.passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isEmailVerified: userData.isEmailVerified,
        },
      });
      expect(result).toEqual(createdUser);
    });

    it('should set isEmailVerified to false by default', async () => {
      const userData = {
        email: 'new@example.com',
        passwordHash: 'hashed_password',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const createdUser = {
        ...userData,
        isEmailVerified: false,
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(createdUser);

      await repository.create(userData);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          passwordHash: userData.passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isEmailVerified: false,
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const updateData = {
        firstName: 'Updated Name',
        isEmailVerified: true,
      };

      const updatedUser = {
        ...mockUser,
        ...updateData,
        updatedAt: new Date(),
      };

      prismaMock.user.update.mockResolvedValue(updatedUser);

      const result = await repository.update('1', updateData);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          firstName: 'Updated Name',
          isEmailVerified: true,
          updatedAt: expect.anything(),
        },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should handle partial updates', async () => {
      const updateData = {
        email: 'updated@example.com',
      };

      const updatedUser = {
        ...mockUser,
        email: 'updated@example.com',
        updatedAt: new Date(),
      };

      prismaMock.user.update.mockResolvedValue(updatedUser);

      await repository.update('1', updateData);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          email: 'updated@example.com',
          updatedAt: expect.anything(),
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete user and return true', async () => {
      prismaMock.user.delete.mockResolvedValue(mockUser);

      const result = await repository.delete('1');

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });
  });
});
