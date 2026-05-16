const express = require('express');
const cors = require('cors');
const metricsService = require('./src/metricsService');
const aiEngine = require('./src/aiEngine');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── Dashboard ───────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  try {
    const metrics = metricsService.getMetrics();
    const trendData = metricsService.getTrendData();
    const intelligence = aiEngine.generateInsights(metrics, trendData);
    res.json({
      success: true,
      data: { metrics, trendData, intelligence, activityFeed: metricsService.getActivityFeed() }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Detail Panel ────────────────────────────────────────
app.get('/api/details/:type', (req, res) => {
  try {
    res.json({ success: true, data: metricsService.getDetails(req.params.type) });
  } catch (err) {
    console.error('Details error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Full Activity Feed ───────────────────────────────────
app.get('/api/activity', (req, res) => {
  try {
    res.json({ success: true, data: metricsService.getFullActivityFeed() });
  } catch (err) {
    console.error('Activity error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Engineering Team ─────────────────────────────────────
app.get('/api/team', (req, res) => {
  try {
    res.json({ success: true, data: metricsService.getTeam() });
  } catch (err) {
    console.error('Team error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Developer Leaderboard ───────────────────────────────
app.get('/api/leaderboard', (req, res) => {
  try {
    res.json({ success: true, data: metricsService.getLeaderboard() });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Code Review Queue ───────────────────────────────────
app.get('/api/review-queue', (req, res) => {
  try {
    res.json({ success: true, data: metricsService.getReviewQueue() });
  } catch (err) {
    console.error('Review queue error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Analytics ────────────────────────────────────────────
app.get('/api/analytics', (req, res) => {
  try {
    res.json({ success: true, data: metricsService.getAnalytics() });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 DevMetrics API running on http://localhost:${PORT}`);
});
