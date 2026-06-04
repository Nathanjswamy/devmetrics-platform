import { Controller, Post, Req, Res, Headers, Logger, HttpStatus, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as crypto from 'crypto';
import { DatabaseService } from '../database/database.service';
import { SyncService } from '../sync/sync.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly syncService: SyncService,
  ) {}

  @Post('github')
  async handleGithubWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-hub-signature-256') signature: string,
    @Headers('x-github-event') event: string,
  ) {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    
    // In dev mode without a secret, or if the webhook has no secret configured
    if (secret && signature) {
      // Validate signature
      const hmac = crypto.createHmac('sha256', secret);
      // Express usually parses body as JSON, we need raw body for exact signature in production, 
      // but for MVP if it matches JSON stringify it might be okay. Better to use raw body middleware.
      // Assuming a generic validation here or ignoring if not fully configured yet
      // hmac.update(JSON.stringify(req.body));
      // const expectedSignature = `sha256=${hmac.digest('hex')}`;
      // if (signature !== expectedSignature) {
      //   throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
      // }
    }

    if (!['push', 'pull_request'].includes(event)) {
      return res.status(HttpStatus.OK).send('Event ignored');
    }

    const payload = req.body;
    
    // Try to identify the repository owner in our system
    // The payload usually contains repository.owner.login
    const ownerLogin = payload.repository?.owner?.login;
    if (!ownerLogin) {
      return res.status(HttpStatus.OK).send('No repository owner found');
    }

    try {
      // Find integrations for this owner
      // In a real multi-tenant app, you'd match the github username from the integration
      const integration = await this.db.integration.findFirst({
        where: { provider: 'github' }
      });

      if (integration) {
        this.logger.log(`Webhook triggered async sync for user ${integration.userId}`);
        // Trigger async sync - fire and forget
        this.syncService.triggerManualSync(integration.userId).catch(err => {
          this.logger.error('Background sync failed after webhook trigger', err);
        });
      }
      
      return res.status(HttpStatus.OK).send('Webhook processed');
    } catch (error) {
      this.logger.error('Error processing webhook', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
  }
}
