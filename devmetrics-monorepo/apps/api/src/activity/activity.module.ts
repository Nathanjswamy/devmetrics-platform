import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';

@Injectable()
class ActivityService {
  constructor(private readonly db: DatabaseService) {}
  async findAll() {
    const commits = await this.db.commit.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { author: true, repo: true }
    });
    
    const prs = await this.db.pullRequest.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { author: true, repo: true }
    });
    
    const reviews = await this.db.review.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { author: true, pullRequest: { include: { repo: true } } }
    });

    const stream: any[] = [];
    
    commits.forEach(c => {
      stream.push({
        id: `commit-${c.id}`,
        type: 'commit',
        actor: c.author?.name || c.author?.email || 'Unknown',
        actor_avatar: c.author?.avatar || null,
        message: `committed: ${c.message}`,
        repo: c.repo?.name,
        timestamp: c.createdAt,
        severity: null
      });
    });

    prs.forEach(pr => {
      stream.push({
        id: `pr-${pr.id}`,
        type: pr.status === 'merged' ? 'pr_merged' : 'pr_opened',
        actor: pr.author?.name || pr.author?.email || 'Unknown',
        actor_avatar: pr.author?.avatar || null,
        message: `${pr.status === 'merged' ? 'merged' : 'opened'} PR: ${pr.title}`,
        repo: pr.repo?.name,
        timestamp: pr.createdAt,
        severity: null
      });
    });

    reviews.forEach(r => {
      stream.push({
        id: `review-${r.id}`,
        type: 'review',
        actor: r.author?.name || r.author?.email || 'Unknown',
        actor_avatar: r.author?.avatar || null,
        message: `${r.state.toLowerCase()} PR: ${r.pullRequest?.title}`,
        repo: r.pullRequest?.repo?.name,
        timestamp: r.submittedAt || r.createdAt,
        severity: null
      });
    });

    // Sort by timestamp descending and take top 20
    return stream.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 20).map(s => {
      // Format timestamp to "Xm ago", "Xh ago" etc just like mock data
      const diffMin = Math.floor((Date.now() - s.timestamp.getTime()) / 60000);
      let timeStr = `${diffMin}m ago`;
      if (diffMin > 60) timeStr = `${Math.floor(diffMin / 60)}h ago`;
      if (diffMin > 1440) timeStr = `${Math.floor(diffMin / 1440)}d ago`;
      return { ...s, timestamp: timeStr };
    });
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
