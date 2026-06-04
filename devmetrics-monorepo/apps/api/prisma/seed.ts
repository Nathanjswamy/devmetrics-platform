import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding baseline data...');

  // Create default user (used by frontend hardcoding currently)
  const user = await prisma.user.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      email: 'admin@acme.com',
      name: 'Engineering Mgr',
      githubId: 'admin_github_id_mock',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
  });

  console.log(`Upserted User: ${user.name}`);
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
