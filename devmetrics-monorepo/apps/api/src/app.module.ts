import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { SyncModule } from './sync/sync.module';
import { DatabaseModule } from './database/database.module';
import { MetricsModule } from './metrics/metrics.module';
import { TeamModule } from './team/team.module';
import { PrsModule } from './prs/prs.module';
import { InsightsModule } from './insights/insights.module';
import { ActivityModule } from './activity/activity.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ActionsModule } from './actions/actions.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { CoachModule } from './coach/coach.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // 100 requests per minute
    }]),
    AuthModule,
    IntegrationsModule,
    SyncModule,
    DatabaseModule,
    MetricsModule,
    TeamModule,
    PrsModule,
    InsightsModule,
    ActivityModule,
    AnalyticsModule,
    WebhooksModule,
    ActionsModule,
    IntelligenceModule,
    CoachModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
