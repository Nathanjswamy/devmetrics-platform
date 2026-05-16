const db = require('./db');

class MetricsService {
  // ── Core KPIs ───────────────────────────────────────────
  getMetrics() {
    const leadTimeRow = db.prepare(`
      SELECT AVG((julianday(merged_at) - julianday(created_at)) * 24) as avgLeadTime
      FROM pull_requests
      WHERE status = 'merged' AND merged_at IS NOT NULL
    `).get();

    const cycleTimeRow = db.prepare(`
      SELECT AVG((julianday(completed_at) - julianday(started_at)) * 24) as avgCycleTime
      FROM issues
      WHERE status = 'done' AND completed_at IS NOT NULL AND started_at IS NOT NULL
    `).get();

    const deploymentFreqRow = db.prepare(`
      SELECT COUNT(*) as count FROM deployments
      WHERE deployed_at >= date('now', '-30 days')
    `).get();

    const totalIssues = db.prepare(`SELECT COUNT(*) as count FROM issues WHERE status = 'done'`).get().count;
    const totalBugs = db.prepare(`SELECT COUNT(*) as count FROM bugs`).get().count;
    const bugRate = totalIssues > 0 ? (totalBugs / totalIssues) * 100 : 0;

    const prThroughputRow = db.prepare(`
      SELECT COUNT(*) as count FROM pull_requests
      WHERE status = 'merged' AND merged_at >= date('now', '-30 days')
    `).get();

    return {
      leadTimeHours: leadTimeRow.avgLeadTime ? Math.round(leadTimeRow.avgLeadTime * 10) / 10 : 0,
      cycleTimeHours: cycleTimeRow.avgCycleTime ? Math.round(cycleTimeRow.avgCycleTime * 10) / 10 : 0,
      deploymentFrequency: deploymentFreqRow.count,
      bugRatePercentage: Math.round(bugRate * 10) / 10,
      prThroughput: prThroughputRow.count
    };
  }

  // ── 14-day Trend ────────────────────────────────────────
  getTrendData() {
    return db.prepare(`
      WITH RECURSIVE dates(date) AS (
        SELECT date('now', '-14 days')
        UNION ALL
        SELECT date(date, '+1 day') FROM dates WHERE date < date('now')
      )
      SELECT
        dates.date,
        COUNT(DISTINCT d.id)  as deployments,
        COUNT(DISTINCT p.id)  as prs_merged,
        COUNT(DISTINCT b.id)  as bugs_reported
      FROM dates
      LEFT JOIN deployments    d ON date(d.deployed_at) = dates.date
      LEFT JOIN pull_requests  p ON date(p.merged_at)   = dates.date AND p.status = 'merged'
      LEFT JOIN bugs           b ON date(b.reported_at) = dates.date
      GROUP BY dates.date ORDER BY dates.date ASC
    `).all();
  }

  // ── Live Activity Feed (dashboard widget) ───────────────
  getActivityFeed() {
    return this._buildActivityFeed(15);
  }

  // ── Full Activity Feed (activity page) ──────────────────
  getFullActivityFeed() {
    return this._buildActivityFeed(100);
  }

  _buildActivityFeed(limit) {
    const prs = db.prepare(`
      SELECT 'pr' as type, id, title, merged_at as timestamp, status, developer_id, size
      FROM pull_requests WHERE merged_at IS NOT NULL ORDER BY merged_at DESC LIMIT ?
    `).all(limit);

    const issues = db.prepare(`
      SELECT 'issue' as type, id, title, completed_at as timestamp, status, developer_id, type as issue_type
      FROM issues WHERE completed_at IS NOT NULL ORDER BY completed_at DESC LIMIT ?
    `).all(limit);

    const devs = db.prepare(`SELECT * FROM developers`).all().reduce((acc, d) => {
      acc[d.id] = d; return acc;
    }, {});

    return [...prs, ...issues]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .map(item => ({ ...item, developer: devs[item.developer_id] || { name: 'Unknown' } }));
  }

  // ── Detail Panel ────────────────────────────────────────
  getDetails(type) {
    if (type === 'leadTime' || type === 'prThroughput') {
      return db.prepare(`
        SELECT p.*, d.name as developer_name, d.role as developer_role,
          ROUND((julianday(merged_at) - julianday(created_at)) * 24, 1) as lead_time_hours
        FROM pull_requests p JOIN developers d ON p.developer_id = d.id
        WHERE p.status = 'merged' ORDER BY p.merged_at DESC LIMIT 50
      `).all();
    }
    if (type === 'cycleTime') {
      return db.prepare(`
        SELECT i.*, d.name as developer_name, d.role as developer_role,
          ROUND((julianday(completed_at) - julianday(started_at)) * 24, 1) as cycle_time_hours
        FROM issues i JOIN developers d ON i.developer_id = d.id
        WHERE i.status = 'done' ORDER BY i.completed_at DESC LIMIT 50
      `).all();
    }
    if (type === 'deploymentFreq') {
      return db.prepare(`
        SELECT *, ROUND((julianday('now') - julianday(deployed_at)) * 24, 0) as hours_ago
        FROM deployments ORDER BY deployed_at DESC LIMIT 50
      `).all();
    }
    if (type === 'bugRate') {
      return db.prepare(`
        SELECT b.*, d.version as deployment_version, d.deployed_at
        FROM bugs b LEFT JOIN deployments d ON b.deployment_id = d.id
        ORDER BY b.reported_at DESC LIMIT 50
      `).all();
    }
    return [];
  }

  // ── Developer Leaderboard ────────────────────────────────
  getLeaderboard() {
    return db.prepare(`
      SELECT d.id, d.name, d.role, d.team,
        COUNT(p.id) as pr_count,
        ROUND(AVG((julianday(p.merged_at) - julianday(p.created_at)) * 24), 1) as avg_lead_time,
        SUM(p.size) as total_lines_written
      FROM developers d
      LEFT JOIN pull_requests p ON p.developer_id = d.id AND p.status = 'merged'
      GROUP BY d.id ORDER BY pr_count DESC
    `).all();
  }

  // ── Engineering Team (detailed per-developer stats) ──────
  getTeam() {
    const devs = db.prepare(`SELECT * FROM developers ORDER BY team, name`).all();

    return devs.map(dev => {
      const prStats = db.prepare(`
        SELECT COUNT(*) as total_prs, SUM(size) as total_lines,
          ROUND(AVG((julianday(merged_at)-julianday(created_at))*24),1) as avg_lead_time,
          MIN(ROUND((julianday(merged_at)-julianday(created_at))*24,1)) as best_lead_time,
          MAX(ROUND((julianday(merged_at)-julianday(created_at))*24,1)) as worst_lead_time
        FROM pull_requests WHERE developer_id = ? AND status = 'merged'
      `).get(dev.id);

      const issueStats = db.prepare(`
        SELECT COUNT(*) as total_issues,
          ROUND(AVG((julianday(completed_at)-julianday(started_at))*24),1) as avg_cycle_time
        FROM issues WHERE developer_id = ? AND status = 'done'
      `).get(dev.id);

      const openPRs = db.prepare(`
        SELECT COUNT(*) as count FROM pull_requests WHERE developer_id = ? AND status = 'open'
      `).get(dev.id);

      const recentPRs = db.prepare(`
        SELECT title, size, merged_at,
          ROUND((julianday(merged_at)-julianday(created_at))*24,1) as lead_time_hours
        FROM pull_requests WHERE developer_id = ? AND status = 'merged'
        ORDER BY merged_at DESC LIMIT 5
      `).all(dev.id);

      return {
        ...dev,
        ...prStats,
        ...issueStats,
        open_prs: openPRs.count,
        recent_prs: recentPRs,
      };
    });
  }

  // ── Code Review Queue ────────────────────────────────────
  getReviewQueue() {
    return db.prepare(`
      SELECT p.id, p.title, p.size, p.created_at,
        d.name as developer_name, d.role as developer_role, d.team as developer_team,
        ROUND((julianday('now') - julianday(p.created_at)), 0) as days_open
      FROM pull_requests p JOIN developers d ON p.developer_id = d.id
      WHERE p.status = 'open' ORDER BY p.created_at ASC
    `).all();
  }

  // ── Analytics ────────────────────────────────────────────
  getAnalytics() {
    // Sprint 1 = days 30–16 ago, Sprint 2 = days 15–0 ago
    const sprintCompare = db.prepare(`
      SELECT
        ROUND(AVG(CASE WHEN p.merged_at BETWEEN date('now','-30 days') AND date('now','-16 days')
          THEN (julianday(p.merged_at)-julianday(p.created_at))*24 END),1) as s1_lead_time,
        ROUND(AVG(CASE WHEN p.merged_at >= date('now','-15 days')
          THEN (julianday(p.merged_at)-julianday(p.created_at))*24 END),1) as s2_lead_time,
        COUNT(CASE WHEN p.merged_at BETWEEN date('now','-30 days') AND date('now','-16 days') THEN 1 END) as s1_prs,
        COUNT(CASE WHEN p.merged_at >= date('now','-15 days') THEN 1 END) as s2_prs,
        ROUND(AVG(CASE WHEN p.merged_at BETWEEN date('now','-30 days') AND date('now','-16 days')
          THEN p.size END),0) as s1_avg_size,
        ROUND(AVG(CASE WHEN p.merged_at >= date('now','-15 days')
          THEN p.size END),0) as s2_avg_size
      FROM pull_requests p WHERE p.status='merged'
    `).get();

    const sprintDeployments = db.prepare(`
      SELECT
        COUNT(CASE WHEN deployed_at BETWEEN date('now','-30 days') AND date('now','-16 days') THEN 1 END) as s1_deploys,
        COUNT(CASE WHEN deployed_at >= date('now','-15 days') THEN 1 END) as s2_deploys,
        COUNT(CASE WHEN deployed_at >= date('now','-15 days') AND status='failed' THEN 1 END) as s2_failures
      FROM deployments
    `).get();

    const sprintBugs = db.prepare(`
      SELECT
        COUNT(CASE WHEN reported_at BETWEEN date('now','-30 days') AND date('now','-16 days') THEN 1 END) as s1_bugs,
        COUNT(CASE WHEN reported_at >= date('now','-15 days') THEN 1 END) as s2_bugs
      FROM bugs
    `).get();

    const bugsBySeverity = db.prepare(`
      SELECT severity, COUNT(*) as count FROM bugs GROUP BY severity ORDER BY count DESC
    `).all();

    const issuesByType = db.prepare(`
      SELECT type, COUNT(*) as count FROM issues GROUP BY type ORDER BY count DESC
    `).all();

    const leadTimeDistribution = db.prepare(`
      SELECT
        CASE
          WHEN (julianday(merged_at)-julianday(created_at))*24 < 12   THEN '< 12h'
          WHEN (julianday(merged_at)-julianday(created_at))*24 < 24   THEN '12–24h'
          WHEN (julianday(merged_at)-julianday(created_at))*24 < 48   THEN '24–48h'
          WHEN (julianday(merged_at)-julianday(created_at))*24 < 96   THEN '48–96h'
          ELSE '> 96h'
        END as bucket,
        COUNT(*) as count
      FROM pull_requests WHERE status='merged'
      GROUP BY bucket
    `).all();

    const deploymentSuccessRate = db.prepare(`
      SELECT status, COUNT(*) as count FROM deployments GROUP BY status
    `).all();

    return {
      sprintCompare: { ...sprintCompare, ...sprintDeployments, ...sprintBugs },
      bugsBySeverity,
      issuesByType,
      leadTimeDistribution,
      deploymentSuccessRate,
    };
  }
}

module.exports = new MetricsService();
