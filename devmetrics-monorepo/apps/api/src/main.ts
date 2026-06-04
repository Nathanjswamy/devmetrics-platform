import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Enable graceful shutdown for containerized environments (Railway, Docker)
  app.enableShutdownHooks();

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('DevMetrics API')
    .setDescription('AI-Powered Engineering Intelligence Platform API')
    .setVersion('1.0')
    .addTag('metrics', 'Engineering metrics and DORA data')
    .addTag('team', 'Developer and team data')
    .addTag('prs', 'Pull request analytics')
    .addTag('insights', 'AI-generated insights')
    .addTag('activity', 'Team activity stream')
    .addTag('analytics', 'Sprint and trend analytics')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'DevMetrics API Docs',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 DevMetrics API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
