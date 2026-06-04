const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
  const prs = await prisma.pullRequest.count();
  const commits = await prisma.commit.count();
  const repos = await prisma.repository.count();
  const users = await prisma.user.count();
  console.log({ PullRequests: prs, Commits: commits, Repositories: repos, Users: users });
  await prisma.$disconnect();
}
checkCounts();
