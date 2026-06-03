import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';

@Injectable()
class TeamService {
  constructor(private readonly db: DatabaseService) {}
  async findAll() { 
    const users = await this.db.user.findMany();
    return users.map(u => ({...u, velocity: 80, impact: 85, reliability: 90, prs_opened: 10, prs_merged: 9, reviews_given: 15, avg_review_time: '2.0h', commits_this_week: 12, trend: 'neutral'}));
  }
  async getLeaderboard() { 
    const users = await this.db.user.findMany();
    return users.map(u => ({...u, velocity: 90, impact: 85, reliability: 90, prs_opened: 10, prs_merged: 9, reviews_given: 15, avg_review_time: '2.0h', commits_this_week: 12, trend: 'neutral'}));
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
