// Shared TypeScript types for DevMetrics platform

export interface DeveloperMetric {
  id: string;
  name: string;
  avatar: string;
  role: string;
  velocity: number;
  impact: number;
  reliability: number;
  prsOpened: number;
  prsMerged: number;
  reviewsGiven: number;
  avgReviewTime: string;
  commitsThisWeek: number;
  trend: "up" | "down" | "neutral";
}

export interface DoraMetric {
  name: string;
  value: string;
  unit: string;
  trend: number; // percent change
  trendDirection: "up" | "down";
  isGoodUp: boolean; // whether upward trend is positive
  description: string;
  icon: string;
}

export interface PullRequest {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  repo: string;
  age: string;
  ageHours: number;
  reviewers: number;
  additions: number;
  deletions: number;
  labels: string[];
  status: "fresh" | "aging" | "stale";
}

export interface AIInsight {
  id: string;
  repoId?: string;
  title: string;
  problem?: string;
  impact?: string;
  recommendation: string;
  priority: "info" | "low" | "medium" | "high" | "critical";
  confidence: number;
  category: string;
  effort?: string;
  expectedOutcome?: string;
  createdAt: string;
  affectedTeam?: string;
}

export interface RepositoryScore {
  id: string;
  repoId: string;
  projectScore: number;
  securityScore: number;
  architectureScore: number;
  testingScore: number;
  documentationScore: number;
  dependencyScore: number;
  techDebtScore: number;
  maintainabilityScore: number;
  strengths: string;
  weaknesses: string;
  risks: string;
  recommendedActions: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  type: "deploy" | "pr_merged" | "incident" | "review" | "commit" | "alert";
  actor: string;
  actorAvatar: string;
  message: string;
  repo?: string;
  timestamp: string;
  severity?: "low" | "medium" | "high";
}

export interface SprintData {
  sprint: string;
  velocity: number;
  planned: number;
  completed: number;
  bugRate: number;
  leadTime: number;
}

export interface DeploymentRisk {
  score: number; // 0-100
  level: "low" | "medium" | "high" | "critical";
  factors: { label: string; weight: number; value: string }[];
}

export interface HealthScore {
  overall: number; // 0-100
  dimensions: {
    label: string;
    score: number;
    color: string;
  }[];
}
