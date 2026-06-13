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
    
    // Aggregations
    const now = Date.now();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);
    const fourDaysAgo = new Date(now - 4 * 24 * 60 * 60 * 1000);

    const allRepos = await this.db.repository.findMany({ include: { commits: { include: { author: true } } }});
    const staleRepos = allRepos.filter(r => !r.commits.some(c => c.createdAt >= sixtyDaysAgo) && r.commits.length > 0);
    
    const stalePrs = await this.db.pullRequest.findMany({
      where: { status: 'fresh', githubCreatedAt: { lt: fourDaysAgo } },
      include: { author: true, repo: true }
    });

    const activeRepos = allRepos.filter(r => r.commits.some(c => c.createdAt >= thirtyDaysAgo));
    const busFactorRepos: any[] = [];
    for (const repo of activeRepos) {
      const recentCommits = repo.commits.filter(c => c.createdAt >= thirtyDaysAgo);
      const authorCounts: Record<string, { count: number, name: string }> = {};
      for (const c of recentCommits) {
        authorCounts[c.authorId] = authorCounts[c.authorId] || { count: 0, name: c.author.name || c.author.email || 'Unknown' };
        authorCounts[c.authorId].count++;
      }
      
      const counts = Object.values(authorCounts);
      if (counts.length > 0) {
        const topAuthor = counts.sort((a,b) => b.count - a.count)[0];
        const totalCommits = recentCommits.length;
        if (topAuthor.count / totalCommits > 0.75 && totalCommits > 5) {
          busFactorRepos.push({ repo: repo.name, topAuthor: topAuthor.name, percentage: Math.round((topAuthor.count / totalCommits) * 100) });
        }
      }
    }

    const contextArr: string[] = [];
    if (staleRepos.length > 0) {
      contextArr.push(`Stale Repositories (no commits in 60+ days): ${staleRepos.map(r => r.name).join(', ')}`);
    }
    if (stalePrs.length > 0) {
      contextArr.push(`Aging PRs: ${stalePrs.map(pr => `PR #${pr.id} in ${pr.repo.name} by ${pr.author.name || 'Unknown'} (open for ${Math.floor((now - pr.githubCreatedAt!.getTime()) / 86400000)} days)`).join('; ')}`);
    }
    if (busFactorRepos.length > 0) {
      contextArr.push(`Bus Factor Risks: ${busFactorRepos.map(r => `${r.repo} has ${r.percentage}% of commits by ${r.topAuthor}`).join('; ')}`);
    }

    if (contextArr.length === 0) {
      return { message: 'No problematic areas detected.' };
    }

    const prompt = `
      You are an elite Engineering Manager. Analyze the following problematic areas detected in the engineering repositories.
      You must convert these facts into EXACTLY ${Math.min(5, contextArr.length * 2)} actionable recommendations.

      Data:
      ${contextArr.join('\n')}

      Respond with a JSON array of insight objects. Do NOT use generic titles like "Repository Health Risk". Use exact repository names and actionable titles.
      Each object must have:
      - "title" (string, max 80 chars, e.g. "Archive white-rose-archive or assign owner")
      - "description" (string, EXACTLY why it is problematic using the provided facts)
      - "severity" (string, exactly one of: 'warning', 'critical')
      - "category" (string, e.g., 'Velocity', 'Bus Factor', 'Maintenance')
      - "affectedTeam" (string or null, use the repo name or author name)
      - "confidence" (number, 90-100)
      - "recommendation" (string, highly actionable, exactly what the developer should do next)
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content || '{}');
      const insights = parsed.insights || parsed;

      if (Array.isArray(insights)) {
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
      
      // Deterministic Fallback
      await this.db.insight.deleteMany();
      const systemInsights: any[] = [];
      
      for (const repo of staleRepos.slice(0, 2)) {
        systemInsights.push({
          title: `Archive or update ${repo.name}`,
          description: `${repo.name} has had no commits for over 60 days.`,
          severity: 'warning',
          category: 'Maintenance',
          confidence: 100,
          affectedTeam: repo.name,
          recommendation: `Archive ${repo.name} to reduce clutter, or assign an owner to revive it.`
        });
      }
      
      for (const pr of stalePrs.slice(0, 2)) {
        systemInsights.push({
          title: `Review aging PR in ${pr.repo.name}`,
          description: `PR #${pr.id} by ${pr.author.name || 'Unknown'} has been open for > 4 days.`,
          severity: 'warning',
          category: 'Velocity',
          confidence: 100,
          affectedTeam: pr.repo.name,
          recommendation: `Assign a reviewer to unblock ${pr.author.name || 'this developer'}.`
        });
      }

      for (const bus of busFactorRepos.slice(0, 2)) {
        systemInsights.push({
          title: `Bus factor risk in ${bus.repo}`,
          description: `${bus.topAuthor} accounts for ${bus.percentage}% of recent commits in ${bus.repo}.`,
          severity: 'critical',
          category: 'Bus Factor',
          confidence: 100,
          affectedTeam: bus.repo,
          recommendation: `Onboard additional developers to ${bus.repo} to distribute knowledge.`
        });
      }
      
      for (const insight of systemInsights) {
        await this.db.insight.create({ data: insight });
      }
      return { message: 'Deterministic insights generated', count: systemInsights.length };
    }
  }
}