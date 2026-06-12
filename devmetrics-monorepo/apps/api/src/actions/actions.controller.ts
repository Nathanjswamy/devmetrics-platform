import { Controller, Post, Body } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('actions')
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post('create-issue')
  @ApiOperation({ summary: 'Create a new GitHub issue from an insight' })
  createIssue(@Body() data: { title: string; body: string; repoId: string; userId: string }) {
    return this.actionsService.createGitHubIssue(data.userId, data.repoId, data.title, data.body);
  }

  @Post('draft-pr-summary')
  @ApiOperation({ summary: 'Draft a PR summary using AI' })
  draftPrSummary(@Body() data: { pullRequestId: string }) {
    return this.actionsService.draftPrSummary(data.pullRequestId);
  }

  @Post('suggest-refactor')
  @ApiOperation({ summary: 'Suggest refactoring for an insight' })
  suggestRefactor(@Body() data: { insightId: string }) {
    return this.actionsService.suggestRefactor(data.insightId);
  }
}
