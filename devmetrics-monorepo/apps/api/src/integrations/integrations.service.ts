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

    // Save to Integration table
    await this.db.integration.upsert({
      where: { id: userId + '_github' }, // Temporary unique ID strategy
      update: {
        accessToken,
        profileId: githubUser.login,
        connectedAt: new Date(),
      },
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
    const integration = await this.db.integration.findFirst({
      where: { userId, provider: 'github' }
    });
    
    if (!integration) return null;

    const repos = await this.db.repository.findMany({
      where: { integration: 'github' },
      orderBy: { updatedAt: 'desc' }
    });

    return { integration, repos };
  }
}
