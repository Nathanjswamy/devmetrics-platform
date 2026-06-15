import { Controller, Post, Body, Param } from '@nestjs/common';
import { CoachService } from './coach.service';

@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post(':repoId')
  async askQuestion(
    @Param('repoId') repoId: string,
    @Body('question') question: string,
  ) {
    return this.coachService.askCoach(repoId, question);
  }
}
