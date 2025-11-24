import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../modules/database/prisma.service';
import { prismaMock } from './utils/prisma-mock';

export const createTestingModule = async (
  providers: any[] = [],
  imports: any[] = [],
) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: PrismaService,
        useValue: prismaMock,
      },
      ...providers,
    ],
    imports,
  }).compile();

  return moduleFixture;
};
