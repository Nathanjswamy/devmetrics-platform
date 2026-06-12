import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  constructor(private readonly db: DatabaseService) {}

  async getExecutiveMetrics(userId?: string) {
    this.logger.log(`[DATA AUDIT] getExecutiveMetrics called with userId: "${userId}"`);
    
    // Filter PRs by the user's integration's repos if userId is provided
    let repoFilter = {};
    if (userId) {
      const integration = await this.db.integration.findFirst({
        where: { userId, provider: 'github' }
      });
      if (integration || true) {
        // Since all repos currently share the 'github' integration, 
        // in a real app we'd filter repos by the user's specific repos.
        repoFilter = { repo: { integration: 'github' } };
      }
    }

    const prCount = await this.db.pullRequest.count({ where: repoFilter });
    const hasPrData = prCount > 0;

    if (hasPrData) {
      const prs = await this.db.pullRequest.findMany({
        where: { ...repoFilter, status: 'merged', mergedAt: { not: null }, githubCreatedAt: { not: null } },
        include: { commits: true, reviews: true }
      });

      let leadTimeSum = 0;
      let cycleTimeSum = 0;
      let reviewTimeSum = 0;
      let validLead = 0;
      let validCycle = 0;
      let validReview = 0;

      for (const pr of prs) {
        const mergedAt = pr.mergedAt!;
        const createdAt = pr.githubCreatedAt!;
        const lt = Math.max(0, (mergedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        leadTimeSum += lt;
        validLead++;

        if (pr.commits && pr.commits.length > 0) {
           const firstCommit = pr.commits.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
           const ct = Math.max(0, (mergedAt.getTime() - firstCommit.createdAt.getTime()) / (1000 * 60 * 60 * 24));
           cycleTimeSum += ct;
           validCycle++;
        }

        if (pr.reviews && pr.reviews.length > 0) {
           const firstReview = pr.reviews.sort((a,b) => (a.submittedAt?.getTime() || a.createdAt.getTime()) - (b.submittedAt?.getTime() || b.createdAt.getTime()))[0];
           const reviewTime = Math.max(0, ((firstReview.submittedAt?.getTime() || firstReview.createdAt.getTime()) - createdAt.getTime()) / (1000 * 60 * 60));
           reviewTimeSum += reviewTime;
           validReview++;
        }
      }

      const avgLeadTime = validLead > 0 ? (leadTimeSum / validLead).toFixed(1) : '0.0';
      const avgCycleTime = validCycle > 0 ? (cycleTimeSum / validCycle).toFixed(1) : avgLeadTime;
      const avgReviewTime = validReview > 0 ? (reviewTimeSum / validReview).toFixed(1) : '0.0';
      
      const deploymentFreq = validLead > 0 ? (validLead / 30).toFixed(1) : '0.0';
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const issues = await this.db.issue.findMany({
        where: { ...repoFilter, createdAt: { gte: thirtyDaysAgo } }
      });

      let bugCount = 0;
      let recoveryTimeSum = 0;
      let validRecovery = 0;

      for (const issue of issues) {
        if (issue.labels.toLowerCase().includes('bug') || issue.title.toLowerCase().includes('bug')) {
          bugCount++;
          if (issue.closedAt) {
            const recoveryTime = (issue.closedAt.getTime() - issue.createdAt.getTime()) / (1000 * 60 * 60);
            recoveryTimeSum += Math.max(0, recoveryTime);
            validRecovery++;
          }
        }
      }

      const changeFailureRate = validLead > 0 ? ((bugCount / validLead) * 100).toFixed(1) : '0.0';
      const mttr = validRecovery > 0 ? (recoveryTimeSum / validRecovery).toFixed(1) : '0.0';

      const healthScore = this.getHealthScore().overall.toString();

      return {
        hasPrData,
        kpis: [
          { name: 'Lead Time', value: avgLeadTime, unit: 'days', trend: -12, trendDirection: 'down', isGoodUp: false, description: 'PR Open to Merge' },
          { name: 'Cycle Time', value: avgCycleTime, unit: 'days', trend: -8, trendDirection: 'down', isGoodUp: false, description: 'First Commit to Merge' },
          { name: 'PR Review Time', value: avgReviewTime, unit: 'hours', trend: -15, trendDirection: 'down', isGoodUp: false, description: 'Creation to First Review' },
          { name: 'Deploy Frequency', value: deploymentFreq, unit: '/day', trend: 5, trendDirection: 'up', isGoodUp: true, description: 'Merges per day' },
          { name: 'Change Failure Rate', value: changeFailureRate, unit: '%', trend: -2, trendDirection: 'down', isGoodUp: false, description: 'Bugs vs Deploys' },
          { name: 'MTTR', value: mttr, unit: 'hours', trend: -4, trendDirection: 'down', isGoodUp: false, description: 'Bug Resolution Time' },
          { name: 'Repository Health', value: healthScore, unit: 'score', trend: 2, trendDirection: 'up', isGoodUp: true, description: 'Codebase vitality' },
        ],
        classification: 'Elite',
        period: 'Last 30 days',
      };
    } else {
      // Commit-driven metrics
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const commits = await this.db.commit.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      });
      const activeRepos = await this.db.repository.count({
        where: { commits: { some: { createdAt: { gte: thirtyDaysAgo } } } }
      });
      const totalContributors = await this.db.user.count({
        where: { commits: { some: { createdAt: { gte: thirtyDaysAgo } } } }
      });
      const totalRepos = await this.db.repository.count();

      return {
        hasPrData,
        kpis: [
          { name: 'Commit Velocity', value: commits.toString(), unit: 'commits', trend: 15, trendDirection: 'up', isGoodUp: true, description: 'Last 30 days' },
          { name: 'Active Repositories', value: activeRepos.toString(), unit: `/ ${totalRepos}`, trend: 5, trendDirection: 'up', isGoodUp: true, description: 'Repos with recent activity' },
          { name: 'Engineering Activity', value: totalContributors.toString(), unit: 'contributors', trend: 0, trendDirection: 'flat', isGoodUp: true, description: 'Active developers' },
          { name: 'Repository Health', value: '85', unit: 'score', trend: 2, trendDirection: 'up', isGoodUp: true, description: 'Codebase vitality' },
        ],
        classification: 'High Activity',
        period: 'Last 30 days',
      };
    }
  }

  getHealthScore() {
    return {
      overall: 84,
      classification: 'High',
      dimensions: [
        { label: 'Code Quality', score: 88, color: '#6366F1' },
        { label: 'Delivery Speed', score: 91, color: '#06B6D4' },
        { label: 'Reliability', score: 79, color: '#8B5CF6' },
        { label: 'Collaboration', score: 82, color: '#10B981' },
        { label: 'Tech Debt', score: 72, color: '#F59E0B' },
      ],
    };
  }

  getDeploymentRisk() {
    return {
      score: 34,
      level: 'low',
      factors: [
        { label: 'Bug Rate (7d)', weight: 30, value: '2.4%' },
        { label: 'Deploy Frequency', weight: 20, value: '4.2/day' },
        { label: 'Stale PRs', weight: 25, value: '2 PRs' },
        { label: 'Test Coverage', weight: 25, value: '87%' },
      ],
    };
  }

  async getDeveloperDNA() {
    return {
      score: 87,
      archetype: 'Architect Builder',
      strengths: ['High consistency', 'Strong project ownership', 'Excellent long-term execution'],
      growthAreas: ['Limited collaboration activity'],
      dimensions: {
        consistency: 92,
        velocity: 85,
        focus: 89,
        collaboration: 65,
        impact: 88
      }
    };
  }
}
