import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users);

  const integrations = await prisma.integration.findMany();
  console.log("Integrations:", integrations);

  const repos = await prisma.repository.findMany();
  console.log("Repos:", repos.map(r => ({ name: r.name, status: r.syncStatus })));

  const prs = await prisma.pullRequest.count();
  console.log("PRs:", prs);

  const commits = await prisma.commit.count();
  console.log("Commits:", commits);
}

main().catch(console.error).finally(() => prisma.$disconnect());
