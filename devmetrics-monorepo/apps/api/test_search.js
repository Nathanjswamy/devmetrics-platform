const { PrismaClient } = require('./node_modules/@prisma/client');
const { Octokit } = require('@octokit/rest');

async function testSync() {
  const prisma = new PrismaClient();
  const integration = await prisma.integration.findFirst({ where: { provider: 'github' } });
  const octokit = new Octokit({ auth: integration.accessToken });
  
  try {
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 20 });
    for (const r of repos) {
        const { data: prs } = await octokit.pulls.list({ owner: r.owner.login, repo: r.name, state: 'all' });
        if (prs.length > 0) console.log(r.name, prs.length);
    }
  } catch(e) {
    console.error(e);
  }
  await prisma.$disconnect();
}
testSync();
