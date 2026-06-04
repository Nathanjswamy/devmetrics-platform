import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import OpenAI from 'openai';

@Injectable()
export class InsightsService {
  private readonly logger = new Logger(InsightsService.name);
  private openai: OpenAI;

  constructor(private readonly db: DatabaseService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async findAll() {
    return this.db.insight.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCritical() {
    return this.db.insight.findMany({
      where: { severity: 'critical' },
      orderBy: { confidence: 'desc' },
    });
  }

  async generateInsights() {
    this.logger.log('Generating AI Insights...');
    
    const recentPrs = await this.db.pullRequest.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { author: true, repo: true }
    });

    const recentCommits = await this.db.commit.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { author: true, repo: true }
    });

    if (recentPrs.length === 0 && recentCommits.length === 0) {
      return { message: 'No data to analyze.' };
    }

    const prSummary = recentPrs.map(pr => `PR "${pr.title}" in ${pr.repo.name} by ${pr.author.name || pr.author.email} - Status: ${pr.status}, Age: ${Math.floor((Date.now() - pr.createdAt.getTime()) / (1000 * 60 * 60))} hours, Additions: ${pr.additions}, Deletions: ${pr.deletions}`).join('\n');
    const commitSummary = recentCommits.map(c => `Commit in ${c.repo.name} by ${c.author.name || c.author.email}: "${c.message}" on ${c.createdAt.toISOString().split('T')[0]}`).join('\n');

    const prompt = `
      You are an elite Engineering Manager and AI Assistant. Analyze the following recent engineering activity (Pull Requests and Commits) and provide 3 highly actionable engineering insights.
      If PRs are missing, focus entirely on Commit activity, consistency, repo distribution, and overall health. Never say "0 insights" or fail to generate insights.

      Recent PRs:
      ${prSummary || 'None'}

      Recent Commits (last 50):
      ${commitSummary || 'None'}

      Respond with a JSON array of insight objects. Each object must have:
      - "title" (string, max 50 chars)
      - "description" (string, 1-2 sentences)
      - "severity" (string, exactly one of: 'info', 'warning', 'critical', 'success')
      - "category" (string, e.g., 'Velocity', 'Code Quality', 'Bottleneck', 'Consistency', 'Health')
      - "affectedTeam" (string or null)
      - "confidence" (number, 0-100)
      - "recommendation" (string, highly actionable)
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content || '{}');
      const insights = parsed.insights || parsed; // Handle wrapping

      if (Array.isArray(insights)) {
        // Clear old insights and insert new ones
        await this.db.insight.deleteMany();

        for (const insight of insights) {
          await this.db.insight.create({
            data: {
              title: insight.title,
              description: insight.description,
              severity: insight.severity,
              category: insight.category,
              affectedTeam: insight.affectedTeam,
              confidence: insight.confidence,
              recommendation: insight.recommendation,
            }
          });
        }
        return { message: 'Insights generated successfully', count: insights.length };
      }
      return { message: 'Failed to parse AI response' };
    } catch (error) {
      this.logger.error('Error generating insights', error);
      
      // Fallback for 429 quota issues
      if (error?.status === 429 || error?.message?.includes('quota') || error?.status === 500) {
        this.logger.warn('AI unavailable. Generating deterministic system insights from commit data.');
        await this.db.insight.deleteMany();
        
        const systemInsights: any[] = [];
        
        if (recentCommits.length > 0) {
           const repoCounts: Record<string, number> = {};
           recentCommits.forEach(c => {
             repoCounts[c.repo.name] = (repoCounts[c.repo.name] || 0) + 1;
           });
           
           const sortedRepos = Object.entries(repoCounts).sort((a, b) => b[1] - a[1]);
           const topRepo = sortedRepos[0]?.[0];
           
           systemInsights.push({
             title: 'System Insight: Activity Overview',
             description: `Recorded ${recentCommits.length} recent commits across ${sortedRepos.length} repositories in the database.`,
             severity: 'info',
             category: 'Activity',
             confidence: 100,
             recommendation: 'System-generated metric.'
           });
           
           if (topRepo) {
             systemInsights.push({
               title: 'System Insight: Primary Focus',
               description: `The most active repository recently is ${topRepo} with ${sortedRepos[0][1]} commits.`,
               severity: 'info',
               category: 'Focus',
               confidence: 100,
               recommendation: 'System-generated metric.'
             });
           }
        } else {
           systemInsights.push({
             title: 'System Insight: No Activity Found',
             description: 'There are no recent commits or pull requests recorded in the database.',
             severity: 'warning',
             category: 'Health',
             confidence: 100,
             recommendation: 'Check repository sync status or connect GitHub to populate data.'
           });
        }
        
        for (const insight of systemInsights) {
          await this.db.insight.create({ data: insight });
        }
        return { message: 'Deterministic insights generated due to AI unavailability', count: systemInsights.length };
      }
      throw error;
    }
  }
}