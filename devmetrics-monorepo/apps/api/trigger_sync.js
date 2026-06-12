const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module.js');
const { SyncService } = require('./dist/sync/sync.service.js');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const syncService = app.get(SyncService);
  
  console.log('Triggering manual sync for test-user...');
  try {
    await syncService.triggerManualSync('1');
    console.log('Sync completed successfully.');
  } catch (error) {
    console.error('Manual sync failed', error);
  }
  
  await app.close();
}

bootstrap();
