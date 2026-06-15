import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InsightsService } from './insights.service';

@ApiTags('insights')
@Controller('insights')
export class InsightsController {
  constructor(private readonly service: InsightsService) {}

  @Get() 
  @ApiOperation({ summary: 'Get all AI insights' }) 
  findAll() { 
    return this.service.findAll(); 
  }

  @Get('critical') 
  @ApiOperation({ summary: 'Get critical insights only' }) 
  critical() { 
    return this.service.getCritical(); 
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate new insights using Gemini' })
  generate() {
    return this.service.generateInsights();
  }
}
