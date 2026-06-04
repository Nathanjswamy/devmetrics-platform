const { PrismaClient } = require('./node_modules/@prisma/client');
const { Octokit } = require('@octokit/rest');

async function testSearch() {
  const prisma = new PrismaClient();
  const integration = await prisma.integration.findFirst({ where: { provider: 'github' } });
  const octokit = new Octokit({ auth: integration.accessToken });
  try {
    const { data: prs } = await octokit.search.issuesAndPullRequests({ q: 'is:pr', per_page: 5 });
    console.log(`Found ${prs.total_count} PRs globally`);
    console.log(prs.items.map(p => p.html_url));
  } catch(e) { console.error(e); }
  await prisma.$disconnect();
}
testSearch();
