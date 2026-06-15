import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GoogleGenAI } from '@google/genai';

export interface RepoAnalysisData {
  name: string;
  owner: string;
  tree: string[];
  packageJson: string;
  readme: string;
}

@Injectable()
export class IntelligenceService {
  private readonly logger = new Logger(IntelligenceService.name);
  private ai: GoogleGenAI;

  constructor(private readonly db: DatabaseService) {
    try {
      this.ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
    } catch (error) {
      this.logger.error('Failed to initialize Google Gemini AI client', error);
    }
  }

  async generateRepositoryIntelligence(repoId: string, data: RepoAnalysisData) {
    this.logger.log(`Generating intelligence for repo ${data.name}`);

    // Parse package.json dependencies
    let deps: string[] = [];
    try {
      const pkg = JSON.parse(data.packageJson);
      deps = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
    } catch(e) {}

    const prompt = `
You are an elite Engineering Architect and Security Engineer. Analyze the following repository structure and configuration.
Repository Name: ${data.name}

File Tree (max 1000 items shown):
${data.tree.slice(0, 1000).join('\n')}

Dependencies:
${deps.join(', ')}

README snippet:
${data.readme.substring(0, 500)}

Generate actionable Engineering Intelligence.
Respond ONLY with a JSON object. No markdown formatting around it.

Expected JSON Structure:
{
  "scores": {
    "projectScore": 0-100,
    "securityScore": 0-100,
    "architectureScore": 0-100,
    "testingScore": 0-100,
    "documentationScore": 0-100,
    "dependencyScore": 0-100,
    "techDebtScore": 0-100,
    "maintainabilityScore": 0-100
  },
  "summary": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "risks": ["string"],
    "recommendedActions": ["string"]
  },
  "insights": [
    {
      "title": "Short title",
      "problem": "Exact issue",
      "impact": "Why it matters",
      "recommendation": "Actionable fix",
      "priority": "low|medium|high|critical",
      "confidence": 0-100,
      "category": "security|architecture|tech_debt|testing|documentation|dependency",
      "effort": "e.g., 30 minutes",
      "expectedOutcome": "What improves"
    }
  ]
}
`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const content = response.text;
      const parsed = JSON.parse(content || '{}');

      if (parsed.scores) {
        await this.db.repositoryScore.upsert({
          where: { repoId },
          update: {
            ...parsed.scores,
            strengths: JSON.stringify(parsed.summary?.strengths || []),
            weaknesses: JSON.stringify(parsed.summary?.weaknesses || []),
            risks: JSON.stringify(parsed.summary?.risks || []),
            recommendedActions: JSON.stringify(parsed.summary?.recommendedActions || []),
          },
          create: {
            repoId,
            ...parsed.scores,
            strengths: JSON.stringify(parsed.summary?.strengths || []),
            weaknesses: JSON.stringify(parsed.summary?.weaknesses || []),
            risks: JSON.stringify(parsed.summary?.risks || []),
            recommendedActions: JSON.stringify(parsed.summary?.recommendedActions || []),
          }
        });
      }

      if (parsed.insights && Array.isArray(parsed.insights)) {
        for (const insight of parsed.insights) {
          await this.db.insight.create({
            data: {
              repoId,
              title: insight.title,
              problem: insight.problem,
              impact: insight.impact,
              recommendation: insight.recommendation,
              priority: insight.priority,
              confidence: insight.confidence || 90,
              category: insight.category,
              effort: insight.effort,
              expectedOutcome: insight.expectedOutcome,
              affectedTeam: data.name
            }
          });
        }
      }
      
      this.logger.log(`Successfully generated intelligence for ${data.name}`);
    } catch(e) {
      this.logger.error('Error generating intelligence from Gemini', e);
    }
  }
}
