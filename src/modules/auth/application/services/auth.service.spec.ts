import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

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
    const mockUserRepository = {
      findByEmail: jest.fn().mockName('findByEmail'),
      create: jest.fn().mockName('create'),
      findById: jest.fn().mockName('findById'),
      findAll: jest.fn().mockName('findAll'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const createdUser = {
        id: '2',
        email: registerData.email,
        passwordHash: `hashed_${registerData.password}`,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(createdUser);

      const result = await service.register(
        registerData.email,
        registerData.password,
        registerData.firstName,
        registerData.lastName,
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        registerData.email,
      );
      expect(userRepository.create).toHaveBeenCalledWith({
        email: registerData.email,
        passwordHash: `hashed_${registerData.password}`,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        isEmailVerified: false,
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw error if user with email already exists', async () => {
      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register(
          registerData.email,
          registerData.password,
          registerData.firstName,
          registerData.lastName,
        ),
      ).rejects.toThrow('User with this email already exists');

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        registerData.email,
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should successfully login user with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password',
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.login(loginData.email, loginData.password);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginData = {
        email: 'notfound@example.com',
        password: 'password',
      };

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login(loginData.email, loginData.password),
      ).rejects.toThrow(UnauthorizedException);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.login(loginData.email, loginData.password),
      ).rejects.toThrow(UnauthorizedException);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.getUserById('1');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.getUserById('1')).rejects.toThrow('User not found');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      userRepository.findAll.mockResolvedValue(users);

      const result = await service.getAllUsers();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
});
