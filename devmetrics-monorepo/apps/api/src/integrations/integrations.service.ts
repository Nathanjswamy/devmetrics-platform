import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(private readonly db: DatabaseService) {}

  async getGithubAuthUrl(userId: string) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    
    const isProd = process.env.NODE_ENV === 'production';
    const defaultApiUrl = isProd 
      ? 'https://devmetrics-platform-production.up.railway.app' 
      : 'http://localhost:4000';
    
    const apiUrl = process.env.API_URL || defaultApiUrl;
    const redirectUri = encodeURIComponent(`${apiUrl}/api/v1/integrations/github/callback`);
    
    // Generate Signed State to prevent CSRF
    const payload = JSON.stringify({ userId, exp: Date.now() + 1000 * 60 * 15 }); // 15 mins expiry
    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET || 'dev-secret')
                            .update(payload).digest('hex');
    const state = Buffer.from(JSON.stringify({ payload, signature })).toString('base64');

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,read:user&state=${state}`;
    
    this.logger.log(`Generated OAuth URL: ${authUrl}`);
    return authUrl;
  }

  async handleGithubCallback(code: string, state: string) {
    // Verify Signed State to prevent CSRF
    let userId: string;
    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
      const { payload, signature } = decoded;
      
      this.logger.log(`OAuth state payload: ${payload}`);

      const expectedSignature = crypto.createHmac('sha256', process.env.JWT_SECRET || 'dev-secret')
                                      .update(payload).digest('hex');
      
      if (signature !== expectedSignature) {
        throw new Error('Invalid CSRF signature');
      }
      
      const parsedPayload = JSON.parse(payload);
      if (parsedPayload.exp < Date.now()) {
        throw new Error('OAuth state expired');
      }
      userId = parsedPayload.userId;
    } catch (e) {
      this.logger.error('CSRF verification failed', e);
      throw new Error('Invalid or expired state parameter');
    }
    
    this.logger.log(`Handling GitHub callback for user ${userId}`);
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' }
    });

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      throw new Error('Failed to retrieve access token from GitHub');
    }

    // Get GitHub User profile
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const githubUser = userResponse.data;

    this.logger.log(`[User Sync] Local user lookup initiated for ${userId}...`);
    let localUser = await this.db.user.findUnique({ where: { id: userId } });
    
    if (localUser) {
      this.logger.log(`[User Sync] User found: ${JSON.stringify(localUser)}`);
    } else {
      this.logger.log(`[User Sync] User not found locally. Attempting to create from GitHub data...`);
      
      let email = githubUser.email;
      if (!email) {
        // Fetch emails from GitHub API if primary email is missing/private
        try {
          const emailsResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const primaryEmailObj = emailsResponse.data.find((e: any) => e.primary) || emailsResponse.data[0];
          email = primaryEmailObj?.email || `${githubUser.login}@users.noreply.github.com`;
        } catch (e) {
          this.logger.error('Failed to fetch user emails from GitHub', e);
          email = `${githubUser.login}@users.noreply.github.com`;
        }
      }

      // Upsert to handle potential race conditions or conflicting emails
      try {
        localUser = await this.db.user.upsert({
          where: { id: userId },
          update: {
            githubId: githubUser.id.toString(),
            avatar: githubUser.avatar_url,
          },
          create: {
            id: userId,
            email: email,
            name: githubUser.name || githubUser.login,
            username: githubUser.login,
            avatar: githubUser.avatar_url,
            githubId: githubUser.id.toString(),
          }
        });
        this.logger.log(`[User Sync] User created dynamically: ${JSON.stringify(localUser)}`);
        this.logger.log(`[User Sync] User synced successfully from Supabase/GitHub.`);
      } catch (e) {
        this.logger.error('Failed to auto-create user record', e);
        throw new Error('User synchronization failed during OAuth. Please ensure your account is properly created.');
      }
    }

    const integrationPayload = {
      accessToken,
      profileId: githubUser.login,
      connectedAt: new Date(),
    };
    
    this.logger.log(`[Integration Sync] Creating integration record... Payload: ${JSON.stringify({ userId, ...integrationPayload })}`);

    // Save to Integration table
    await this.db.integration.upsert({
      where: { id: userId + '_github' }, // Temporary unique ID strategy
      update: integrationPayload,
      create: {
        id: userId + '_github',
        userId,
        provider: 'github',
        profileId: githubUser.login,
        accessToken,
      }
    });

    // Update user githubId
    await this.db.user.update({
      where: { id: userId },
      data: { githubId: githubUser.id.toString() }
    });

    return { success: true, profileId: githubUser.login };
  }

  async getGithubIntegration(userId: string) {
    this.logger.log(`[DATA AUDIT] getGithubIntegration called with userId: "${userId}"`);
    
    // Log total counts for auditing
    const totalUsers = await this.db.user.count();
    const totalIntegrations = await this.db.integration.count();
    const integrationsForUser = await this.db.integration.count({ where: { userId } });
    const totalRepos = await this.db.repository.count();
    const totalMetrics = await this.db.pullRequest.count();
    this.logger.log(`[DATA AUDIT] DB Totals - Users: ${totalUsers}, Integrations: ${totalIntegrations} (For this user: ${integrationsForUser}), Repositories: ${totalRepos}, Metrics(PRs): ${totalMetrics}`);
    this.logger.log(`[DATA AUDIT] DB Totals - Users: ${totalUsers}, Integrations: ${totalIntegrations}, Repositories: ${totalRepos}`);

    let integration = await this.db.integration.findFirst({
      where: { userId, provider: 'github' }
    });
    
    this.logger.log(`[DATA AUDIT] Integration found for userId "${userId}": ${integration ? 'YES' : 'NO'}`);
    
    if (!integration) {
      this.logger.log(`[DATA AUDIT] Falling back to any available global GitHub integration...`);
      integration = await this.db.integration.findFirst({
        where: { provider: 'github' }
      });
      
      if (!integration) {
        this.logger.log(`[DATA AUDIT] No global GitHub integration found either.`);
        return null;
      }
      this.logger.log(`[DATA AUDIT] Using fallback integration belonging to userId "${integration.userId}"`);
    }

    const repos = await this.db.repository.findMany({
      where: { integration: 'github' },
      orderBy: { updatedAt: 'desc' }
    });
    
    this.logger.log(`[DATA AUDIT] Returning ${repos.length} repos for integration`);

    return { integration, repos };
  }
}
