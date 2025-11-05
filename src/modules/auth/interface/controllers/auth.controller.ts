import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    return this.authService.register(email, password, firstName, lastName);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }
}
