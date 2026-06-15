import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('intelligence')
export class IntelligenceController {
  constructor(private readonly db: DatabaseService) {}

  @Get(':repoId')
  async getRepositoryIntelligence(@Param('repoId') repoId: string) {
    const repo = await this.db.repository.findUnique({
      where: { id: repoId },
      include: {
        score: true,
        insights: true,
        commits: { orderBy: { createdAt: 'desc' }, take: 10 },
      }
    });

    if (!repo) {
      throw new NotFoundException('Repository not found');
    }

    return repo;
  }
}
