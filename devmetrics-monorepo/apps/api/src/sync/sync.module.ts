import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { IntelligenceModule } from '../intelligence/intelligence.module';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

@Module({
  imports: [ScheduleModule.forRoot(), IntelligenceModule],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService]
})
export class SyncModule {}
