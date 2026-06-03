import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma Database connected');
    await this.seedIfEmpty();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async seedIfEmpty() {
    const count = await this.user.count();
    if (count > 0) {
      this.logger.log('Database already seeded');
      return;
    }

    this.logger.log('Seeding database with Prisma...');

    // Seed Teams
    const team1 = await this.team.create({ data: { name: 'Platform Team' } });
    const team2 = await this.team.create({ data: { name: 'Frontend Team' } });
    
    // Seed Users
    const u1 = await this.user.create({ data: { email: 'arjun@devmetrics.io', name: 'Arjun Mehta', avatar: 'AM', role: 'Staff Engineer' } });
    const u2 = await this.user.create({ data: { email: 'priya@devmetrics.io', name: 'Priya Sharma', avatar: 'PS', role: 'Senior Engineer' } });
    const u3 = await this.user.create({ data: { email: 'ethan@devmetrics.io', name: 'Ethan Cross', avatar: 'EC', role: 'Senior Engineer' } });

    await this.userTeam.createMany({
      data: [
        { userId: u1.id, teamId: team1.id },
        { userId: u2.id, teamId: team1.id },
        { userId: u3.id, teamId: team2.id }
      ]
    });

    // Seed Repos
    const repo1 = await this.repository.create({ data: { name: 'devmetrics-api', url: 'https://github.com/org/api', integration: 'github', teamId: team1.id } });
    const repo2 = await this.repository.create({ data: { name: 'devmetrics-web', url: 'https://github.com/org/web', integration: 'github', teamId: team2.id } });

    // Seed PRs
    await this.pullRequest.createMany({
      data: [
        { title: 'feat: implement AI insight streaming', authorId: u1.id, repoId: repo1.id, url: 'https://github.com/org/api/pull/1', status: 'fresh', additions: 284, deletions: 42 },
        { title: 'refactor: migrate webhook handlers to BullMQ', authorId: u2.id, repoId: repo1.id, url: 'https://github.com/org/api/pull/2', status: 'fresh', additions: 512, deletions: 198 },
        { title: 'fix: resolve race condition in metrics', authorId: u3.id, repoId: repo2.id, url: 'https://github.com/org/web/pull/3', status: 'aging', additions: 88, deletions: 24, createdAt: new Date(Date.now() - 31*3600000) },
        { title: 'feat: add GraphQL subscriptions', authorId: u1.id, repoId: repo1.id, url: 'https://github.com/org/api/pull/4', status: 'stale', additions: 642, deletions: 0, createdAt: new Date(Date.now() - 79*3600000) }
      ]
    });

    // Seed Commits
    await this.commit.createMany({
      data: [
        { message: 'initial commit', hash: 'abc1234', authorId: u1.id, repoId: repo1.id },
        { message: 'setup bullmq', hash: 'def5678', authorId: u2.id, repoId: repo1.id },
        { message: 'fix race condition', hash: 'ghi9012', authorId: u3.id, repoId: repo2.id }
      ]
    });

    this.logger.log('Database seeded successfully via Prisma');
  }
}
