# DevMetrics — Engineering Intelligence Platform

DevMetrics is a professional engineering workflow analytics platform designed to provide real-time insights into team productivity, code quality, and deployment risks. It transforms raw engineering data into actionable intelligence through a modern, high-performance interface.

![Dashboard Preview](https://raw.githubusercontent.com/Nathanjswamy/Developer-workflow-intelligence-/master/preview.png)

## ✨ Features

- **Intelligence Dashboard**: Real-time overview of core DORA metrics (Lead Time, Cycle Time, Deployment Frequency, Bug Rate).
- **AI-Driven Insights**: Automated bottleneck detection and workflow recommendations.
- **Developer Leaderboard**: Gamified performance tracking ranked by impact and efficiency.
- **Code Review Queue**: Visual tracking of PR freshness with aging alerts (Fresh/Aging/Stale).
- **Deployment Risk Meter**: Predictive risk scoring based on bug rates and deployment velocity.
- **Advanced Analytics**: Sprint-over-sprint comparisons and lead time distribution analysis.
- **Live Activity Stream**: Real-time team operation feed.

## 🎨 Design System

Built with a professional **White + Neon** aesthetic:
- **Font**: Plus Jakarta Sans
- **Palette**: Clean off-white foundation with high-contrast neon accents (Indigo, Violet, Cyan, Emerald, Red).
- **Interactivity**: Smooth Framer Motion animations and responsive glassmorphism-inspired components.

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Custom Neon Design System)
- **Framer Motion** (Animations)
- **Recharts** (Data Visualization)
- **Lucide React** (Iconography)
- **Axios** (API Client)
- **React Router 7** (Navigation)

### Backend
- **Node.js** + **Express**
- **SQLite** (Database)
- **Better-SQLite3** (High-performance SQLite driver)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nathanjswamy/Developer-workflow-intelligence-.git
   cd Developer-workflow-intelligence-
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Initialize and seed the database
   node seed.js
   # Start the server
   node server.js
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   # Start the development server
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📊 API Endpoints

- `GET /api/dashboard`: Core metrics and insights.
- `GET /api/team`: Detailed engineering team performance.
- `GET /api/leaderboard`: Ranked developer stats.
- `GET /api/review-queue`: Open PR tracking.
- `GET /api/analytics`: Sprint and distribution data.
- `GET /api/activity`: Full operation history.

---
Built with ❤️ for high-performance engineering teams.
