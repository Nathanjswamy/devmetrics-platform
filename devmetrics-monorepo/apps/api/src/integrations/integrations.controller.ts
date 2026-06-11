import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import type { Response } from 'express';

@ApiTags('integrations')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Get('github/auth')
  @ApiOperation({ summary: 'Initiate GitHub OAuth flow' })
  async githubAuth(@Query('userId') userId: string, @Res() res: Response) {
    const url = await this.service.getGithubAuthUrl(userId);
    return res.redirect(url);
  }

  @Get('github/callback')
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      await this.service.handleGithubCallback(code, state);
      const frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl) throw new Error('FRONTEND_URL is not configured');
      return res.redirect(`${frontendUrl}/integrations/github?success=true`);
    } catch (error: any) {
      console.error('OAuth callback failed', error);
      const isProd = process.env.NODE_ENV === 'production';
      const defaultFrontendUrl = isProd 
        ? 'https://devmetrics-platform-production.up.railway.app' 
        : 'http://localhost:3000';
      const frontendUrl = process.env.FRONTEND_URL || defaultFrontendUrl;
      
      return res.redirect(`${frontendUrl}/integrations/github?error=oauth_failed`);
    }
  }

  @Get('github')
  @ApiOperation({ summary: 'Get GitHub integration status and repos' })
  async getGithubStatus(@Query('userId') userId: string) {
    return this.service.getGithubIntegration(userId);
  }
}
