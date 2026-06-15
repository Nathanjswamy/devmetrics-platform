import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class CoachService {
  private readonly logger = new Logger(CoachService.name);
  private ai: GoogleGenAI;

  constructor(private readonly db: DatabaseService) {
    try {
      this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (error) {
      this.logger.error('Failed to initialize Google Gemini AI client', error);
    }
  }

  async askCoach(repoId: string, question: string) {
    this.logger.log(`Received question for repo ${repoId}: ${question}`);
    
    const repo = await this.db.repository.findUnique({
      where: { id: repoId },
      include: {
        score: true,
        insights: true
      }
    });

    if (!repo) {
      throw new Error('Repository not found');
    }

    const prompt = `
You are an elite Project Coach AI, an expert Engineering Mentor.
The user is asking you a question about their repository: ${repo.name}.

Repository Scores:
Project Score: ${repo.score?.projectScore}/100
Security Score: ${repo.score?.securityScore}/100
Architecture Score: ${repo.score?.architectureScore}/100
Testing Score: ${repo.score?.testingScore}/100
Documentation Score: ${repo.score?.documentationScore}/100
Dependency Score: ${repo.score?.dependencyScore}/100
Technical Debt Score: ${repo.score?.techDebtScore}/100

Strengths: ${repo.score?.strengths}
Weaknesses: ${repo.score?.weaknesses}
Risks: ${repo.score?.risks}
Recommended Actions: ${repo.score?.recommendedActions}

Actionable Insights:
${repo.insights.map(i => `- [${i.priority.toUpperCase()}] ${i.title}: ${i.problem} -> ${i.recommendation}`).join('\n')}

User Question: "${question}"

Answer the user's question directly, concisely, and practically.
Base your answer ONLY on the provided repository context.
If you don't know or if the question is unrelated to the engineering status, gently guide them back to engineering metrics.
Do NOT output JSON. Use standard markdown.
`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return { answer: response.text };
    } catch(e) {
      this.logger.error('Error asking coach', e);
      return { answer: 'I am currently unable to access the AI service. Please try again later.' };
    }
  }
}
