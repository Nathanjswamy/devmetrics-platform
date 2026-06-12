import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';

@Injectable()
class TeamService {
  constructor(private readonly db: DatabaseService) {}
  async findAll() { 
    return this.calculateUserStats();
  }
  async getLeaderboard() { 
    const stats = await this.calculateUserStats();
    return stats.sort((a,b) => (b.velocity + b.impact) - (a.velocity + a.impact));
  }

  private async calculateUserStats() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const users = await this.db.user.findMany({
      include: {
        prs: { where: { githubCreatedAt: { gte: thirtyDaysAgo } } },
        authoredReviews: { where: { createdAt: { gte: thirtyDaysAgo } } },
        commits: { where: { createdAt: { gte: thirtyDaysAgo } } }
      }
    });

    return users.map(u => {
      const prs_opened = u.prs.length;
      const prs_merged = u.prs.filter(pr => pr.status === 'merged').length;
      const reviews_given = u.authoredReviews.length;
      const commits_this_week = u.commits.length;
      
      const velocity = Math.min(100, (prs_merged * 5) + (commits_this_week * 2));
      const impact = Math.min(100, (reviews_given * 4) + (prs_merged * 3));
      const reliability = 90; 
      const avg_review_time = '2.0h'; 

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        githubId: u.githubId,
        velocity,
        impact,
        reliability,
        prs_opened,
        prs_merged,
        reviews_given,
        avg_review_time,
        commits_this_week,
        trend: velocity > 50 ? 'up' : 'neutral'
      };
    }).filter(u => u.commits_this_week > 0 || u.prs_opened > 0 || u.reviews_given > 0);
  }
}

@ApiTags('team')
@Controller('team')
class TeamController {
  constructor(private readonly service: TeamService) {}
  @Get() @ApiOperation({ summary: 'Get all team members' }) findAll() { return this.service.findAll(); }
  @Get('leaderboard') @ApiOperation({ summary: 'Get ranked leaderboard' }) leaderboard() { return this.service.getLeaderboard(); }
}

@Module({ controllers: [TeamController], providers: [TeamService] })
export class TeamModule {}
