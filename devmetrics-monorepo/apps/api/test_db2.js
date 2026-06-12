const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
Promise.all([
  prisma.pullRequest.count(),
  prisma.repository.count(),
  prisma.user.count(),
  prisma.commit.count()
])
  .then(([prs, repos, users, commits]) => {
    console.log({ prs, repos, users, commits });
  })
  .finally(() => prisma.$disconnect());
