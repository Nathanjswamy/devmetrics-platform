import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';

@Injectable()
class ActivityService {
  constructor(private readonly db: DatabaseService) {}
  async findAll() {
    return [
      { id: 'act-1', type: 'deploy', actor: 'Arjun Mehta', actor_avatar: 'AM', message: 'deployed devmetrics-core v2.4.1 to production', repo: 'devmetrics-core', timestamp: '2m ago', severity: null },
      { id: 'act-2', type: 'pr_merged', actor: 'Priya Sharma', actor_avatar: 'PS', message: 'merged PR #842: feat: session replay analytics', repo: 'devmetrics-web', timestamp: '18m ago', severity: null },
      { id: 'act-3', type: 'incident', actor: 'System', actor_avatar: 'SY', message: 'P2 incident resolved: metrics API latency spike', repo: null, timestamp: '34m ago', severity: 'medium' },
      { id: 'act-4', type: 'review', actor: 'Ethan Cross', actor_avatar: 'EC', message: 'approved PR #844: refactor webhook handlers', repo: 'devmetrics-api', timestamp: '52m ago', severity: null }
    ];
  }
}

@ApiTags('activity')
@Controller('activity')
class ActivityController {
  constructor(private readonly service: ActivityService) {}
  @Get() @ApiOperation({ summary: 'Get live activity stream' }) findAll() { return this.service.findAll(); }
}

@Module({ controllers: [ActivityController], providers: [ActivityService] })
export class ActivityModule {}
