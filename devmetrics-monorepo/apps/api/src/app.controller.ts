import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly db: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'devmetrics-api',
    };
  }

  @Get('status')
  async getStatus(@Req() req: any) {
    // Check DB health
    let dbStatus = 'healthy';
    let repoCount = 0;
    let commitCount = 0;
    
    try {
      repoCount = await this.db.repository.count();
      commitCount = await this.db.commit.count();
    } catch (e) {
      dbStatus = 'degraded';
    }
    
    // Check GitHub connection
    const integration = await this.db.integration.findFirst({
      where: { provider: 'github' }
    });
    
    const githubStatus = integration ? 'connected' : 'disconnected';
    const lastSyncTime = integration?.connectedAt || null;
    
    // Check AI status (just verify key is present for MVP)
    const aiStatus = process.env.OPENAI_API_KEY ? 'operational' : 'unavailable';
    
    return {
      githubConnection: githubStatus,
      lastSyncTime,
      repositoryCount: repoCount,
      commitCount,
      aiServiceStatus: aiStatus,
      databaseHealth: dbStatus,
    };
  }
}
