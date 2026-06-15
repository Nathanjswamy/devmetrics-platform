import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { InsightsService } from './src/insights/insights.service';

async function bootstrap() {
  console.log('Bootstrapping NestJS context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const insightsService = app.get(InsightsService);
  
  console.log('Triggering generateInsights()...');
  const result = await insightsService.generateInsights();
  console.log('Generation Result:', result);

  const allInsights = await insightsService.findAll();
  console.log('\n--- GENERATED INSIGHTS FROM DB ---');
  console.log(JSON.stringify(allInsights, null, 2));

  await app.close();
}
bootstrap().catch(console.error);
