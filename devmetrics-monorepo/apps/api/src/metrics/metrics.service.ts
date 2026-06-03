import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MetricsService {
  constructor(private readonly db: DatabaseService) {}

  async getExecutiveMetrics() {
    const prs = await this.db.pullRequest.findMany({
      where: { status: 'merged', mergedAt: { not: null }, githubCreatedAt: { not: null } },
      include: { commits: true }
    });

    let leadTimeSum = 0;
    let cycleTimeSum = 0;
    let validLead = 0;
    let validCycle = 0;

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
    }

    const avgLeadTime = validLead > 0 ? (leadTimeSum / validLead).toFixed(1) : '0.0';
    const avgCycleTime = validCycle > 0 ? (cycleTimeSum / validCycle).toFixed(1) : avgLeadTime;

    return {
      dora: [
        { name: 'Lead Time', value: avgLeadTime, unit: 'days', trend: -12, trendDirection: 'down', isGoodUp: false, description: 'PR Open to Merge' },
        { name: 'Cycle Time', value: avgCycleTime, unit: 'days', trend: -8, trendDirection: 'down', isGoodUp: false, description: 'First Commit to Merge' },
      ],
      classification: 'Elite',
      period: 'Last 30 days',
    };
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
}
