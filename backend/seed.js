const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'dev.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// ─── Schema ─────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS developers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    team TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pull_requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    size INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL,
    merged_at TEXT,
    developer_id TEXT NOT NULL,
    FOREIGN KEY (developer_id) REFERENCES developers(id)
  );

  CREATE TABLE IF NOT EXISTS deployments (
    id TEXT PRIMARY KEY,
    version TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'success',
    deployed_at TEXT NOT NULL,
    pr_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo',
    started_at TEXT,
    completed_at TEXT,
    developer_id TEXT,
    FOREIGN KEY (developer_id) REFERENCES developers(id)
  );

  CREATE TABLE IF NOT EXISTS bugs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    severity TEXT NOT NULL,
    reported_at TEXT NOT NULL,
    deployment_id TEXT,
    FOREIGN KEY (deployment_id) REFERENCES deployments(id)
  );
`);

// ─── Helpers ────────────────────────────────────────────
const uuid = () => crypto.randomUUID();

function randomDate(startDaysAgo, endDaysAgo) {
  const now = Date.now();
  const start = now - startDaysAgo * 86400000;
  const end = now - endDaysAgo * 86400000;
  return new Date(start + Math.random() * (end - start)).toISOString();
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Seed ───────────────────────────────────────────────
console.log('🌱 Seeding database...\n');

// Clear existing data
db.exec(`
  DELETE FROM bugs;
  DELETE FROM issues;
  DELETE FROM pull_requests;
  DELETE FROM deployments;
  DELETE FROM developers;
`);

// 1. Developers
const devNames = [
  { name: 'Ava Chen', role: 'Frontend', team: 'Growth' },
  { name: 'Marcus Rivera', role: 'Backend', team: 'Core' },
  { name: 'Priya Sharma', role: 'Fullstack', team: 'Platform' },
  { name: 'Jason Kim', role: 'Backend', team: 'Core' },
  { name: 'Sofia Andersen', role: 'Frontend', team: 'Growth' },
  { name: 'Liam O\'Brien', role: 'Fullstack', team: 'Platform' },
];

const insertDev = db.prepare('INSERT INTO developers (id, name, role, team) VALUES (?, ?, ?, ?)');
const devIds = [];

for (const dev of devNames) {
  const id = uuid();
  insertDev.run(id, dev.name, dev.role, dev.team);
  devIds.push(id);
}
console.log(`✅ Created ${devNames.length} developers`);

// 2. Deployments (30 days of history — intentionally uneven cadence)
const insertDeployment = db.prepare('INSERT INTO deployments (id, version, status, deployed_at, pr_count) VALUES (?, ?, ?, ?, ?)');
const deploymentIds = [];

// Sprint 1 (days 30-16): Good cadence — frequent small deploys
for (let i = 0; i < 8; i++) {
  const id = uuid();
  const deployedAt = randomDate(30 - i * 2, 30 - i * 2 - 1);
  insertDeployment.run(id, `v1.${i}.0`, 'success', deployedAt, randomInt(2, 4));
  deploymentIds.push(id);
}

// Sprint 2 (days 15-1): Degraded cadence — fewer, larger deploys (creates a visible bottleneck)
for (let i = 0; i < 4; i++) {
  const id = uuid();
  const deployedAt = randomDate(15 - i * 3, 15 - i * 3 - 2);
  const status = i === 2 ? 'failed' : 'success';
  insertDeployment.run(id, `v2.${i}.0`, status, deployedAt, randomInt(5, 10));
  deploymentIds.push(id);
}
console.log(`✅ Created ${deploymentIds.length} deployments`);

// 3. Pull Requests (intentional pattern: sprint 2 has larger, slower PRs)
const insertPR = db.prepare('INSERT INTO pull_requests (id, title, size, status, created_at, merged_at, developer_id) VALUES (?, ?, ?, ?, ?, ?, ?)');

const prTitles = [
  'Refactor auth middleware', 'Add user settings page', 'Fix pagination bug',
  'Update API response format', 'Implement search filters', 'Add dark mode toggle',
  'Optimize database queries', 'Add unit tests for auth', 'Migrate to new logger',
  'Fix CORS configuration', 'Add rate limiting', 'Update dependencies',
  'Implement caching layer', 'Add analytics tracking', 'Fix memory leak in worker',
  'Add onboarding flow', 'Refactor state management', 'Fix CI pipeline',
  'Add E2E tests', 'Implement webhooks', 'Add CSV export', 'Fix timezone handling',
  'Migrate to TypeScript', 'Add health check endpoint', 'Improve error handling',
];

let prCount = 0;

// Sprint 1 PRs: Small, fast-merging
for (let i = 0; i < 28; i++) {
  const createdAt = randomDate(30, 16);
  const leadTimeHours = randomInt(4, 36); // 4h to 1.5 days — healthy
  const mergedAt = new Date(new Date(createdAt).getTime() + leadTimeHours * 3600000).toISOString();
  insertPR.run(
    uuid(),
    randomItem(prTitles),
    randomInt(30, 200), // Small PRs
    'merged',
    createdAt,
    mergedAt,
    randomItem(devIds)
  );
  prCount++;
}

// Sprint 2 PRs: Larger, slower — creates a visible degradation
for (let i = 0; i < 16; i++) {
  const createdAt = randomDate(15, 1);
  const leadTimeHours = randomInt(36, 120); // 1.5 to 5 days — slow
  const mergedAt = new Date(new Date(createdAt).getTime() + leadTimeHours * 3600000).toISOString();
  insertPR.run(
    uuid(),
    randomItem(prTitles),
    randomInt(200, 800), // Large PRs
    'merged',
    createdAt,
    mergedAt,
    randomItem(devIds)
  );
  prCount++;
}

// A few open PRs still pending
for (let i = 0; i < 5; i++) {
  const createdAt = randomDate(5, 0);
  insertPR.run(
    uuid(),
    randomItem(prTitles),
    randomInt(100, 500),
    'open',
    createdAt,
    null,
    randomItem(devIds)
  );
  prCount++;
}

console.log(`✅ Created ${prCount} pull requests`);

// 4. Issues
const insertIssue = db.prepare('INSERT INTO issues (id, title, type, status, started_at, completed_at, developer_id) VALUES (?, ?, ?, ?, ?, ?, ?)');

const issueTypes = ['feature', 'feature', 'feature', 'bug', 'task'];
let issueCount = 0;

// Sprint 1 issues: Fast cycle time
for (let i = 0; i < 30; i++) {
  const startedAt = randomDate(30, 16);
  const cycleTimeHours = randomInt(8, 72); // Fast cycle
  const completedAt = new Date(new Date(startedAt).getTime() + cycleTimeHours * 3600000).toISOString();
  insertIssue.run(
    uuid(),
    `Sprint 1 Issue ${i}`,
    randomItem(issueTypes),
    'done',
    startedAt,
    completedAt,
    randomItem(devIds)
  );
  issueCount++;
}

// Sprint 2 issues: Slower cycle time
for (let i = 0; i < 22; i++) {
  const startedAt = randomDate(15, 1);
  const cycleTimeHours = randomInt(48, 168); // Slow cycle (2-7 days)
  const completedAt = new Date(new Date(startedAt).getTime() + cycleTimeHours * 3600000).toISOString();
  insertIssue.run(
    uuid(),
    `Sprint 2 Issue ${i}`,
    randomItem(issueTypes),
    'done',
    startedAt,
    completedAt,
    randomItem(devIds)
  );
  issueCount++;
}

// Some in-progress issues
for (let i = 0; i < 6; i++) {
  insertIssue.run(
    uuid(),
    `In Progress Issue ${i}`,
    randomItem(issueTypes),
    'in_progress',
    randomDate(5, 0),
    null,
    randomItem(devIds)
  );
  issueCount++;
}

console.log(`✅ Created ${issueCount} issues`);

// 5. Bugs — More bugs tied to sprint 2 (larger deploys)
const insertBug = db.prepare('INSERT INTO bugs (id, title, severity, reported_at, deployment_id) VALUES (?, ?, ?, ?, ?)');
const severities = ['low', 'medium', 'medium', 'high', 'critical'];
let bugCount = 0;

// Sprint 1: Few bugs (healthy deploys)
for (let i = 0; i < 3; i++) {
  const dep = deploymentIds[Math.floor(Math.random() * 8)]; // First 8 deployments
  const reportedAt = randomDate(30, 16);
  insertBug.run(uuid(), `Minor bug ${i}`, randomItem(['low', 'medium']), reportedAt, dep);
  bugCount++;
}

// Sprint 2: Many bugs (batched deploys cause instability)
for (let i = 0; i < 10; i++) {
  const dep = deploymentIds[8 + Math.floor(Math.random() * 4)]; // Last 4 deployments
  const reportedAt = randomDate(15, 0);
  insertBug.run(uuid(), `Production bug ${i}`, randomItem(severities), reportedAt, dep);
  bugCount++;
}

console.log(`✅ Created ${bugCount} bugs`);

// ─── Verify ─────────────────────────────────────────────
console.log('\n📊 Database summary:');
console.log(`   Developers:    ${db.prepare('SELECT COUNT(*) as c FROM developers').get().c}`);
console.log(`   Pull Requests: ${db.prepare('SELECT COUNT(*) as c FROM pull_requests').get().c}`);
console.log(`   Deployments:   ${db.prepare('SELECT COUNT(*) as c FROM deployments').get().c}`);
console.log(`   Issues:        ${db.prepare('SELECT COUNT(*) as c FROM issues').get().c}`);
console.log(`   Bugs:          ${db.prepare('SELECT COUNT(*) as c FROM bugs').get().c}`);
console.log('\n🎉 Seeding complete!');

db.close();
