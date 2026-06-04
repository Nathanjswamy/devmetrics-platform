const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.pullRequest.findMany({ select: { mergedAt: true }, take: 10, orderBy: { mergedAt: 'desc' } })
  .then(console.log)
  .finally(() => prisma.$disconnect());
