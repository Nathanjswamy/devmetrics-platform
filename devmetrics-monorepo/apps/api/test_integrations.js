const { IntegrationsService } = require('./dist/integrations/integrations.service');
const { DatabaseService } = require('./dist/database/database.service');

async function test() {
  const db = new DatabaseService();
  await db.onModuleInit();
  const service = new IntegrationsService(db);
  const result = await service.getGithubIntegration('test-user');
  console.log(JSON.stringify(result, null, 2));
  await db.$disconnect();
}

test();
