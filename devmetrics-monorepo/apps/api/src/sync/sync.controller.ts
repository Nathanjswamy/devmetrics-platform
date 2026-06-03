import { Controller, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SyncService } from './sync.service';

@ApiTags('sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly service: SyncService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Manually trigger a sync for a user' })
  triggerSync(@Query('userId') userId: string) {
    return this.service.triggerManualSync(userId);
  }
}
