import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';

@Injectable()
class PrsService {
  constructor(private readonly db: DatabaseService) {}
  async findAll() { return this.db.pullRequest.findMany({ include: { author: true, repo: true }, orderBy: { createdAt: 'desc' } }); }
  async getCommandCenter() {
    const openPrs = await this.db.pullRequest.findMany({ where: { status: 'fresh' }, include: { author: true, repo: true } });
    
    const fresh: any[] = [];
    const aging: any[] = [];
    const stale: any[] = [];
    
    const now = Date.now();
    for (const pr of openPrs) {
      if (!pr.githubCreatedAt) continue;
      const daysOld = (now - pr.githubCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysOld > 7) {
        stale.push(pr);
      } else if (daysOld > 3) {
        aging.push(pr);
      } else {
        fresh.push(pr);
      }
    }
    
    return { fresh, aging, stale };
  }
}

@ApiTags('prs')
@Controller('prs')
class PrsController {
  constructor(private readonly service: PrsService) {}
  @Get() @ApiOperation({ summary: 'Get all open pull requests' }) findAll() { return this.service.findAll(); }
  @Get('command-center') @ApiOperation({ summary: 'Get PRs grouped by freshness status' }) commandCenter() { return this.service.getCommandCenter(); }
}

@Module({ controllers: [PrsController], providers: [PrsService] })
export class PrsModule {}
