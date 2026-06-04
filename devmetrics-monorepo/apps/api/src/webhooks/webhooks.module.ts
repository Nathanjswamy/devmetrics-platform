import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { SyncModule } from '../sync/sync.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [SyncModule, DatabaseModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
