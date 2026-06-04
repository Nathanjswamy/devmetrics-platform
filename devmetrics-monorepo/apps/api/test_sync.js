const { PrismaClient } = require('./node_modules/@prisma/client');
const { Octokit } = require('@octokit/rest');

async function testSync() {
  const prisma = new PrismaClient();
  const integration = await prisma.integration.findFirst({ where: { provider: 'github' } });
  
  if (!integration) {
    console.log("No integration found");
    return;
  }
  
  const octokit = new Octokit({ auth: integration.accessToken });
  const { data: repos } = await octokit.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 5 });
  
  for (const repo of repos) {
    console.log("Repo:", repo.full_name);
    try {
      const { data: prs } = await octokit.pulls.list({
        owner: repo.owner.login,
        repo: repo.name,
        state: 'all',
        per_page: 5
      });
      console.log("PRs:", prs.map(pr => ({ id: pr.id, number: pr.number, title: pr.title, user: pr.user?.login })));
    } catch (e) {
      console.error("Error fetching PRs for", repo.name, e);
    }
  }
  await prisma.$disconnect();
}

testSync();
