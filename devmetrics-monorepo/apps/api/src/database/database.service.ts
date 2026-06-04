import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma Database connected');
    await this.seedIfEmpty();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async seedIfEmpty() {
    this.logger.log('Database seeded logic removed to prevent mock data.');
  }
}
