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
    
    // Fetch recent PRs and Commits to analyze
    const recentPrs = await this.db.pullRequest.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { author: true, repo: true }
    });

    if (recentPrs.length === 0) {
      return { message: 'No PRs to analyze.' };
    }

    const prSummary = recentPrs.map(pr => `PR "${pr.title}" in ${pr.repo.name} by ${pr.author.name || pr.author.email} - Status: ${pr.status}, Age: ${Math.floor((Date.now() - pr.createdAt.getTime()) / (1000 * 60 * 60))} hours, Additions: ${pr.additions}, Deletions: ${pr.deletions}`).join('\n');

    const prompt = `
      You are an elite Engineering Manager and AI Assistant. Analyze the following recent Pull Requests and provide 3 highly actionable engineering insights.
      
      Recent PRs:
      ${prSummary}

      Respond with a JSON array of insight objects. Each object must have:
      - "title" (string, max 50 chars)
      - "description" (string, 1-2 sentences)
      - "severity" (string, exactly one of: 'info', 'warning', 'critical', 'success')
      - "category" (string, e.g., 'Velocity', 'Code Quality', 'Bottleneck')
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
      throw error;
    }
  }
}
