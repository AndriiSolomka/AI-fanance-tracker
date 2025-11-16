import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './interface/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { UserRepository } from './application/repositories/user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}
