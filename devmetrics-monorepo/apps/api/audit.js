const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.dobufpwkmdrdspollvuj:DevMetrics2026Secure@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users.map(u => ({ id: u.id, email: u.email })));
  
  const integrations = await prisma.integration.findMany();
  console.log('Integrations:', integrations);
}

main().catch(console.error).finally(() => prisma.$disconnect());
