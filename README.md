# Developer Workflow Intelligence Platform

An AI-powered engineering command center built for modern teams. This platform converts raw engineering metrics into workflow intelligence, bottleneck detection, and actionable insights.

## Overview

Unlike standard productivity dashboards that just show numbers, this platform answers three questions:
1. **What is happening?** (Metrics like Lead Time, Cycle Time, Bug Rate)
2. **Why is it happening?** (AI Narrative Insights explaining bottlenecks)
3. **What should happen next?** (Actionable recommendations)

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Node.js, Express, better-sqlite3
- **Design:** Glassmorphism, deep dark mode, responsive layout

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
node seed.js    # Populates mock data for demoing
node server.js  # Runs API on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Runs React app on http://localhost:5173
```

## AI Heuristic Engine

For this MVP, the AI Engine uses a heuristic rule-based approach to detect patterns. For example:
- **Rule:** If `deployment_frequency` decreases while `bug_rate` increases...
- **Insight:** "Release batching detected. Larger releases are increasing regression risk."
- **Recommendation:** "Shift to continuous deployment; break down PR sizes."

## Design Philosophy

The UI is built to feel premium, intelligent, and highly legible. We avoid cluttered spreadsheet-style tables in favor of dynamic insight cards with smooth micro-animations.
