const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function deleteFakeData() {
  const fakeUsers = await prisma.user.findMany({
    where: { email: { endsWith: '@devmetrics.io' } }
  });

  const fakeUserIds = fakeUsers.map(u => u.id);
  
  if (fakeUserIds.length > 0) {
    console.log(`Deleting ${fakeUserIds.length} fake users...`);
    // Delete dependent data
    await prisma.reviewComment.deleteMany({ where: { authorId: { in: fakeUserIds } } });
    await prisma.review.deleteMany({ where: { authorId: { in: fakeUserIds } } });
    await prisma.requestedReviewer.deleteMany({ where: { userId: { in: fakeUserIds } } });
    await prisma.commit.deleteMany({ where: { authorId: { in: fakeUserIds } } });
    await prisma.pullRequest.deleteMany({ where: { authorId: { in: fakeUserIds } } });
    await prisma.userTeam.deleteMany({ where: { userId: { in: fakeUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: fakeUserIds } } });
    
    // Also delete any repositories that belong to the fake teams or are not tied to the real user
    // For now we'll just delete the fake teams
    const fakeTeams = await prisma.team.findMany();
    const teamIds = fakeTeams.map(t => t.id);
    if (teamIds.length > 0) {
       await prisma.repository.deleteMany({ where: { teamId: { in: teamIds } } });
       await prisma.team.deleteMany({ where: { id: { in: teamIds } } });
    }
  }

  console.log("Fake data removed.");
  await prisma.$disconnect();
}

deleteFakeData().catch(console.error);
