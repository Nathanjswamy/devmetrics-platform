import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('executive')
  @ApiOperation({ summary: 'Get executive DORA metrics and health score' })
  getExecutive(@Query('userId') userId: string) {
    return this.metricsService.getExecutiveMetrics(userId);
  }

  @Get('dna')
  @ApiOperation({ summary: 'Get Developer DNA profile' })
  getDNA() {
    return this.metricsService.getDeveloperDNA();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get engineering health score breakdown' })
  getHealth() {
    return this.metricsService.getHealthScore();
  }

  @Get('risk')
  @ApiOperation({ summary: 'Get deployment risk assessment' })
  getRisk() {
    return this.metricsService.getDeploymentRisk();
  }
}
