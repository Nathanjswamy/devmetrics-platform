import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';
import { Octokit } from '@octokit/rest';

@Injectable()
export class SyncService implements OnModuleInit {
  private readonly logger = new Logger(SyncService.name);

  constructor(private readonly db: DatabaseService) {}

  onModuleInit() {
    this.logger.log('Sync Service initialized');
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this.logger.log('Running background sync job...');
    await this.syncAllIntegrations();
  }

  async syncAllIntegrations() {
    const integrations = await this.db.integration.findMany({
      where: { provider: 'github' }
    });

    for (const integration of integrations) {
      try {
        await this.syncGithub(integration);
      } catch (error) {
        this.logger.error(`Failed to sync GitHub for user ${integration.userId}`, error);
      }
    }
  }

  async triggerManualSync(userId: string) {
    const integration = await this.db.integration.findFirst({
      where: { userId, provider: 'github' }
    });
    
    if (!integration) {
      throw new Error('No GitHub integration found for this user');
    }

    return this.syncGithub(integration);
  }

  private async syncGithub(integration: any) {
    this.logger.log(`Syncing GitHub data for user: ${integration.profileId}`);
    
    const octokit = new Octokit({ auth: integration.accessToken });
    
    try {
      // 1. Sync Repositories
      const { data: repos } = await octokit.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 100 });
      this.logger.log('repositories fetched from GitHub');
      
      let reposSaved = 0;
      for (const repo of repos) {
        const dbRepo = await this.db.repository.upsert({
          where: { githubId: repo.id.toString() },
          update: { 
            name: repo.name,
            url: repo.html_url,
            syncStatus: 'syncing',
          },
          create: {
            githubId: repo.id.toString(),
            name: repo.name,
            url: repo.html_url,
            integration: 'github',
            syncStatus: 'syncing',
          }
        });
        reposSaved++;
        this.logger.log('repositories saved');
        this.logger.log('analysis jobs started');

        // 2. Sync PRs for this repo
        try {
          const { data: prs } = await octokit.pulls.list({
            owner: repo.owner.login,
            repo: repo.name,
            state: 'all',
            per_page: 5
          });
          this.logger.log(`[AUDIT] Fetched ${prs.length} PRs for repo ${repo.name}`);

          for (const pr of prs) {
            let authorId: string | null = null;
            if (pr.user) {
              let author = await this.db.user.findFirst({ where: { githubId: pr.user.id.toString() } });
              if (!author) {
                // Quick stub for the author if they don't exist yet
                author = await this.db.user.create({
                  data: {
                    email: `${pr.user.login}@users.noreply.github.com`,
                    name: pr.user.login,
                    githubId: pr.user.id.toString(),
                    avatar: pr.user.avatar_url,
                  }
                });
              }
              authorId = author.id;
            } else {
              let unknownUser = await this.db.user.findFirst({ where: { githubId: 'unknown' } });
              if (!unknownUser) {
                unknownUser = await this.db.user.create({
                  data: { email: 'unknown@github.com', name: 'Unknown User', githubId: 'unknown', avatar: '' }
                });
              }
              authorId = unknownUser.id;
            }

            const dbPr = await this.db.pullRequest.upsert({
              where: { githubId: pr.id.toString() },
              update: {
                title: pr.title,
                status: pr.state === 'open' ? 'fresh' : (pr.merged_at ? 'merged' : 'closed'),
                githubCreatedAt: new Date(pr.created_at),
                mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
              },
              create: {
                githubId: pr.id.toString(),
                repoId: dbRepo.id,
                title: pr.title,
                url: pr.html_url,
                status: pr.state === 'open' ? 'fresh' : (pr.merged_at ? 'merged' : 'closed'),
                authorId: authorId,
                githubCreatedAt: new Date(pr.created_at),
                mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
              }
            });

            // Fetch commits for this PR to enable Cycle Time
            try {
              const { data: prCommits } = await octokit.pulls.listCommits({
                owner: repo.owner.login,
                repo: repo.name,
                pull_number: pr.number,
                per_page: 5
              });
              this.logger.log(`[AUDIT] Fetched ${prCommits.length} commits for PR ${pr.title}`);

              for (const c of prCommits) {
                 let cAuthorId = authorId;
                 if (c.author) {
                   const cAuthor = await this.db.user.findFirst({ where: { githubId: c.author.id.toString() } });
                   if (cAuthor) cAuthorId = cAuthor.id;
                 }
                 if (cAuthorId) {
                   await this.db.commit.upsert({
                      where: { hash: c.sha },
                      update: { 
                        pullRequestId: dbPr.id,
                        createdAt: c.commit.author?.date ? new Date(c.commit.author.date) : undefined
                      },
                      create: {
                        hash: c.sha,
                        message: c.commit.message,
                        repoId: dbRepo.id,
                        authorId: cAuthorId,
                        pullRequestId: dbPr.id,
                        createdAt: c.commit.author?.date ? new Date(c.commit.author.date) : new Date()
                      }
                   });
                 }
              }
            } catch (e) {
              this.logger.error(`Error syncing commits for PR ${pr.title}`, e);
            }

            // Fetch requested reviewers
            if (pr.requested_reviewers) {
              for (const reqRev of pr.requested_reviewers) {
                 let rrUser = await this.db.user.findFirst({ where: { githubId: reqRev.id.toString() } });
                 if (!rrUser) {
                   rrUser = await this.db.user.create({
                     data: {
                       email: `${reqRev.login}@users.noreply.github.com`,
                       name: reqRev.login,
                       githubId: reqRev.id.toString(),
                       avatar: reqRev.avatar_url,
                     }
                   });
                 }
                 
                 await this.db.requestedReviewer.upsert({
                   where: { pullRequestId_userId: { pullRequestId: dbPr.id, userId: rrUser.id } },
                   update: {},
                   create: { pullRequestId: dbPr.id, userId: rrUser.id }
                 });
              }
            }

            // Fetch Reviews
            try {
              const { data: reviews } = await octokit.pulls.listReviews({
                owner: repo.owner.login,
                repo: repo.name,
                pull_number: pr.number,
                per_page: 10
              });
              this.logger.log(`[AUDIT] Fetched ${reviews.length} reviews for PR ${pr.title}`);

              for (const rev of reviews) {
                 if (!rev.user) continue;
                 let revUser = await this.db.user.findFirst({ where: { githubId: rev.user.id.toString() } });
                 if (!revUser) {
                   revUser = await this.db.user.create({
                     data: {
                       email: `${rev.user.login}@users.noreply.github.com`,
                       name: rev.user.login,
                       githubId: rev.user.id.toString(),
                       avatar: rev.user.avatar_url,
                     }
                   });
                 }

                 await this.db.review.upsert({
                   where: { githubId: rev.id.toString() },
                   update: {
                     state: rev.state,
                     body: rev.body || undefined,
                     submittedAt: rev.submitted_at ? new Date(rev.submitted_at) : undefined,
                   },
                   create: {
                     githubId: rev.id.toString(),
                     pullRequestId: dbPr.id,
                     authorId: revUser.id,
                     state: rev.state,
                     body: rev.body,
                     submittedAt: rev.submitted_at ? new Date(rev.submitted_at) : null,
                   }
                 });
              }
            } catch (e) {
              this.logger.error(`Error syncing reviews for PR ${pr.title}`, e);
            }

            // Fetch Review Comments
            try {
              const { data: comments } = await octokit.pulls.listReviewComments({
                owner: repo.owner.login,
                repo: repo.name,
                pull_number: pr.number,
                per_page: 10
              });
              this.logger.log(`[AUDIT] Fetched ${comments.length} review comments for PR ${pr.title}`);

              for (const c of comments) {
                 if (!c.user) continue;
                 let cUser = await this.db.user.findFirst({ where: { githubId: c.user.id.toString() } });
                 if (!cUser) {
                   cUser = await this.db.user.create({
                     data: {
                       email: `${c.user.login}@users.noreply.github.com`,
                       name: c.user.login,
                       githubId: c.user.id.toString(),
                       avatar: c.user.avatar_url,
                     }
                   });
                 }

                 await this.db.reviewComment.upsert({
                   where: { githubId: c.id.toString() },
                   update: {
                     body: c.body,
                   },
                   create: {
                     githubId: c.id.toString(),
                     pullRequestId: dbPr.id,
                     authorId: cUser.id,
                     body: c.body,
                     createdAt: c.created_at ? new Date(c.created_at) : new Date(),
                   }
                 });
              }
            } catch (e) {
              this.logger.error(`Error syncing review comments for PR ${pr.title}`, e);
            }
          }
        } catch (e) {
          this.logger.error(`Error syncing PRs for ${repo.name}`, e);
        }

        // 3. Sync Commits
        try {
          const { data: commits } = await octokit.repos.listCommits({
            owner: repo.owner.login,
            repo: repo.name,
            per_page: 5
          });
          this.logger.log(`[AUDIT] Fetched ${commits.length} commits for repo ${repo.name}`);

          for (const commit of commits) {
             let author = await this.db.user.findFirst({ where: { githubId: commit.author?.id?.toString() } });
             if (!author && commit.author) {
                author = await this.db.user.create({
                  data: {
                    email: commit.author.login + '@users.noreply.github.com',
                    name: commit.author.login,
                    githubId: commit.author.id.toString(),
                    avatar: commit.author.avatar_url,
                  }
                });
             }

             if (author) {
               await this.db.commit.upsert({
                 where: { hash: commit.sha },
                 update: { 
                   message: commit.commit.message,
                   createdAt: commit.commit.author?.date ? new Date(commit.commit.author.date) : undefined 
                 },
                 create: {
                   hash: commit.sha,
                   message: commit.commit.message,
                   repoId: dbRepo.id,
                   authorId: author.id,
                   createdAt: commit.commit.author?.date ? new Date(commit.commit.author.date) : new Date()
                 }
               });
             }
          }
        } catch(e) {
          this.logger.error(`Error syncing Commits for ${repo.name}`, e);
        }

        // 4. Sync Issues
        try {
          const { data: issues } = await octokit.issues.listForRepo({
            owner: repo.owner.login,
            repo: repo.name,
            state: 'all',
            per_page: 10
          });
          this.logger.log(`[AUDIT] Fetched ${issues.length} issues for repo ${repo.name}`);

          for (const issue of issues) {
             // GitHub API returns PRs as issues too. Ignore PRs.
             if (issue.pull_request) continue;

             let authorId: string | null = null;
             if (issue.user) {
               let author = await this.db.user.findFirst({ where: { githubId: issue.user.id.toString() } });
               if (!author) {
                 author = await this.db.user.create({
                   data: {
                     email: `${issue.user.login}@users.noreply.github.com`,
                     name: issue.user.login,
                     githubId: issue.user.id.toString(),
                     avatar: issue.user.avatar_url,
                   }
                 });
               }
               authorId = author.id;
             }

             let assigneeId: string | null = null;
             if (issue.assignee) {
               let assignee = await this.db.user.findFirst({ where: { githubId: issue.assignee.id.toString() } });
               if (!assignee) {
                 assignee = await this.db.user.create({
                   data: {
                     email: `${issue.assignee.login}@users.noreply.github.com`,
                     name: issue.assignee.login,
                     githubId: issue.assignee.id.toString(),
                     avatar: issue.assignee.avatar_url,
                   }
                 });
               }
               assigneeId = assignee.id;
             }

             const labels = JSON.stringify(issue.labels.map(l => typeof l === 'string' ? l : l.name));

             await this.db.issue.upsert({
               where: { githubId: issue.id.toString() },
               update: {
                 title: issue.title,
                 state: issue.state,
                 body: issue.body || undefined,
                 labels: labels,
                 closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
                 assigneeId: assigneeId
               },
               create: {
                 githubId: issue.id.toString(),
                 repoId: dbRepo.id,
                 number: issue.number,
                 title: issue.title,
                 state: issue.state,
                 url: issue.html_url,
                 body: issue.body,
                 labels: labels,
                 createdAt: new Date(issue.created_at),
                 closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
                 authorId: authorId,
                 assigneeId: assigneeId
               }
             });
          }
        } catch(e) {
          this.logger.error(`Error syncing Issues for ${repo.name}`, e);
        }

        // Mark repo as synced
        await this.db.repository.update({
          where: { id: dbRepo.id },
          data: {
            syncStatus: 'idle',
            lastSyncedAt: new Date()
          }
        });
        
        this.logger.log('analysis jobs completed');
      }

      this.logger.log('repositories saved');
      this.logger.log('metrics generated');
      this.logger.log(`GitHub sync completed for ${integration.profileId}`);
      return { success: true, message: 'Sync completed' };
    } catch (error) {
      this.logger.error('Error during GitHub sync', error);
      throw error;
    }
  }
}
