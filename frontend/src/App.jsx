import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LiveActivity from './pages/LiveActivity';
import EngineeringTeam from './pages/EngineeringTeam';
import ReviewQueuePage from './pages/ReviewQueuePage';
import Analytics from './pages/Analytics';
import PlatformConfig from './pages/PlatformConfig';
import Landing from './pages/Landing';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Protected / App Routes with Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/activity" element={<LiveActivity />} />
                <Route path="/team" element={<EngineeringTeam />} />
                <Route path="/review-queue" element={<ReviewQueuePage />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/config" element={<PlatformConfig />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
