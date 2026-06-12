const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const [repos, prs, commits, reviews, comments] = await Promise.all([
    prisma.repository.count(),
    prisma.pullRequest.count(),
    prisma.commit.count(),
    prisma.review.count(),
    prisma.reviewComment.count()
  ]);
  console.log(`Repos: ${repos}, PRs: ${prs}, Commits: ${commits}, Reviews: ${reviews}, Review Comments: ${comments}`);
}

run().finally(() => prisma.$disconnect());
