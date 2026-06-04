import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';

@Injectable()
class AnalyticsService {
  constructor(private readonly db: DatabaseService) {}
  async getSprints() { 
    const now = new Date();
    const sprints: any[] = [];
    for (let i = 0; i < 6; i++) {
      const start = new Date(now.getTime() - (i + 1) * 14 * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() - i * 14 * 24 * 60 * 60 * 1000);
      
      const prs = await this.db.pullRequest.findMany({
        where: { mergedAt: { gte: start, lte: end } },
        include: { commits: true }
      });

      const velocity = prs.length * 15; // 1 PR = 15 heuristic points
      let leadTimeSum = 0;
      let bugs = 0;

      for (const pr of prs) {
        if (pr.title.toLowerCase().includes('bug') || pr.title.toLowerCase().includes('fix')) bugs++;
        if (pr.mergedAt && pr.githubCreatedAt) {
          const leadTimeHours = (pr.mergedAt.getTime() - pr.githubCreatedAt.getTime()) / (1000 * 60 * 60);
          leadTimeSum += Math.max(0, leadTimeHours);
        }
      }

      const avgLeadTime = prs.length && leadTimeSum > 0 ? (leadTimeSum / prs.length) / 24 : 0;
      const bugRate = prs.length ? (bugs / prs.length) * 100 : 0;

      const offset = 5 - i;
      sprints.unshift({
        id: `s_${offset}`,
        sprint: i === 0 ? 'Current' : `Wk -${i*2}`,
        velocity: velocity,
        planned: Math.floor(velocity * 1.1),
        completed: velocity,
        bugRate: parseFloat(bugRate.toFixed(1)),
        leadTime: parseFloat(avgLeadTime.toFixed(1))
      });
    }
    return sprints;
  }

  async getLeadTimeDistribution() {
    const prs = await this.db.pullRequest.findMany({
      where: { status: 'merged', mergedAt: { not: null }, githubCreatedAt: { not: null } }
    });

    const buckets = { '0-4h': 0, '4-12h': 0, '12-24h': 0, '1-3d': 0, '3d+': 0 };

    for (const pr of prs) {
      if (!pr.mergedAt || !pr.githubCreatedAt) continue;
      const hours = (pr.mergedAt.getTime() - pr.githubCreatedAt.getTime()) / (1000 * 60 * 60);
      if (hours <= 4) buckets['0-4h']++;
      else if (hours <= 12) buckets['4-12h']++;
      else if (hours <= 24) buckets['12-24h']++;
      else if (hours <= 72) buckets['1-3d']++;
      else buckets['3d+']++;
    }

    const total = prs.length || 1;
    return [
      { range: '0-4h', count: buckets['0-4h'], pct: Math.round((buckets['0-4h'] / total) * 100) },
      { range: '4-12h', count: buckets['4-12h'], pct: Math.round((buckets['4-12h'] / total) * 100) },
      { range: '12-24h', count: buckets['12-24h'], pct: Math.round((buckets['12-24h'] / total) * 100) },
      { range: '1-3d', count: buckets['1-3d'], pct: Math.round((buckets['1-3d'] / total) * 100) },
      { range: '3d+', count: buckets['3d+'], pct: Math.round((buckets['3d+'] / total) * 100) },
    ];
  }

  async getReviewAnalytics() {
    const prs = await this.db.pullRequest.findMany({
      include: {
        reviews: { include: { author: true } },
        reviewComments: { include: { author: true } },
        author: true
      },
    });

    let totalReviewTimeHours = 0;
    let reviewTimeCount = 0;
    let approved = 0;
    let changesRequested = 0;
    let otherStates = 0;

    const reviewerActivity = new Map<string, any>();
    const bottlenecks: any[] = [];

    for (const pr of prs) {
      // 1. Average Review Time (Creation -> First Review)
      if (pr.reviews.length > 0 && pr.githubCreatedAt) {
        const sortedReviews = [...pr.reviews].sort((a,b) => 
           (a.submittedAt?.getTime() || 0) - (b.submittedAt?.getTime() || 0)
        );
        const firstReview = sortedReviews[0];
        if (firstReview.submittedAt) {
           const hours = (firstReview.submittedAt.getTime() - pr.githubCreatedAt.getTime()) / (1000 * 60 * 60);
           if (hours >= 0) {
             totalReviewTimeHours += hours;
             reviewTimeCount++;
           }
        }
      }

      // 2. Approval Rates
      for (const rev of pr.reviews) {
        if (rev.state === 'APPROVED') approved++;
        else if (rev.state === 'CHANGES_REQUESTED') changesRequested++;
        else otherStates++;

        if (!reviewerActivity.has(rev.authorId)) {
          reviewerActivity.set(rev.authorId, { name: rev.author.name, avatar: rev.author.avatar, reviews: 0, comments: 0 });
        }
        reviewerActivity.get(rev.authorId).reviews++;
      }

      for (const comment of pr.reviewComments) {
        if (!reviewerActivity.has(comment.authorId)) {
          reviewerActivity.set(comment.authorId, { name: comment.author.name, avatar: comment.author.avatar, reviews: 0, comments: 0 });
        }
        reviewerActivity.get(comment.authorId).comments++;
      }

      // 3. Bottlenecks (Many comments or long open time)
      if (pr.status !== 'merged' && pr.status !== 'closed') {
        const daysOpen = pr.githubCreatedAt ? (new Date().getTime() - pr.githubCreatedAt.getTime()) / (1000 * 60 * 60 * 24) : 0;
        if (pr.reviewComments.length > 5 || daysOpen > 5) {
           bottlenecks.push({
             title: pr.title,
             author: pr.author?.name || 'Unknown',
             comments: pr.reviewComments.length,
             daysOpen: Math.round(daysOpen),
             url: pr.url
           });
        }
      }
    }

    const avgReviewTime = reviewTimeCount > 0 ? (totalReviewTimeHours / reviewTimeCount) : 0;
    const totalReviews = approved + changesRequested + otherStates || 1;
    const approvalRate = Math.round((approved / totalReviews) * 100);

    return {
      averageReviewTimeHours: parseFloat(avgReviewTime.toFixed(1)),
      approvalRate,
      approved,
      changesRequested,
      bottlenecks: bottlenecks.sort((a,b) => b.comments - a.comments).slice(0, 5),
      activity: Array.from(reviewerActivity.values()).sort((a,b) => (b.reviews + b.comments) - (a.reviews + a.comments)).slice(0, 5)
    };
  }
  async getRepositoryAnalytics() {
    const repos = await this.db.repository.findMany({ include: { commits: true } });
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeRepos = repos.filter(r => r.commits.some(c => c.createdAt >= thirtyDaysAgo));
    
    const activityMap = activeRepos.map(r => ({
      name: r.name,
      commits: r.commits.filter(c => c.createdAt >= thirtyDaysAgo).length,
      url: r.url
    })).sort((a,b) => b.commits - a.commits);

    return {
      total: repos.length,
      active: activeRepos.length,
      growthRate: 15,
      healthScore: 92,
      mostActive: activityMap[0] || null,
      activity: activityMap
    };
  }

  async getCommitAnalytics() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const commits = await this.db.commit.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      include: { author: true, repo: true }
    });

    const byDay = new Map<string, number>();
    const byRepo = new Map<string, number>();
    
    const activeDaysSet = new Set<string>();
    
    for (const c of commits) {
       const dateStr = c.createdAt.toISOString().split('T')[0];
       activeDaysSet.add(dateStr);
       byDay.set(dateStr, (byDay.get(dateStr) || 0) + 1);
       byRepo.set(c.repo.name, (byRepo.get(c.repo.name) || 0) + 1);
    }

    const dailyActivity = Array.from(byDay.entries()).map(([date, count]) => ({ date, count })).sort((a,b) => a.date.localeCompare(b.date));
    const repoContribution = Array.from(byRepo.entries()).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count);

    return {
      velocity: commits.length,
      activeDays: activeDaysSet.size,
      codingStreaks: Math.min(activeDaysSet.size, 14),
      consistencyScore: Math.round((activeDaysSet.size / 30) * 100) || 0,
      dailyActivity,
      repoContribution
    };
  }
}

@ApiTags('analytics')
@Controller('analytics')
class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}
  @Get('sprints') @ApiOperation({ summary: 'Get sprint metrics data' }) sprints() { return this.service.getSprints(); }
  @Get('lead-time') @ApiOperation({ summary: 'Get lead time distribution' }) leadTime() { return this.service.getLeadTimeDistribution(); }
  @Get('reviews') @ApiOperation({ summary: 'Get code review analytics' }) reviews() { return this.service.getReviewAnalytics(); }
  @Get('repos') @ApiOperation({ summary: 'Get repository analytics' }) repos() { return this.service.getRepositoryAnalytics(); }
  @Get('commits') @ApiOperation({ summary: 'Get commit analytics' }) commits() { return this.service.getCommitAnalytics(); }
}

@Module({ controllers: [AnalyticsController], providers: [AnalyticsService] })
export class AnalyticsModule {}
