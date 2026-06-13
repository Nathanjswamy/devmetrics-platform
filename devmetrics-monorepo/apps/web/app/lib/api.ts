import axios from "axios";
import type {
  DoraMetric,
  HealthScore,
  DeploymentRisk,
  AIInsight,
  PullRequest,
  SprintData,
  ActivityEvent,
  DeveloperMetric,
} from "../types";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1`,
  timeout: 30000, // higher for AI calls
});

export const api = {
  metrics: {
    getExecutive: async (userId: string) => {
      const { data } = await apiClient.get<{ kpis: any[]; classification?: string; period?: string; hasPrData?: boolean }>(`/metrics/executive?userId=${userId}`);
      return data;
    },
    getHealth: async () => {
      const { data } = await apiClient.get<HealthScore>("/metrics/health");
      return data;
    },
    getRisk: async () => {
      const { data } = await apiClient.get<DeploymentRisk>("/metrics/risk");
      return data;
    },
  },
  insights: {
    getAll: async () => {
      const { data } = await apiClient.get<AIInsight[]>("/insights");
      return data;
    },
    getCritical: async () => {
      const { data } = await apiClient.get<AIInsight[]>("/insights/critical");
      return data;
    },
    generate: async () => {
      const { data } = await apiClient.post<{ message: string; count: number }>("/insights/generate");
      return data;
    },
  },
  prs: {
    getCommandCenter: async () => {
      const { data } = await apiClient.get<{ fresh: PullRequest[]; aging: PullRequest[]; stale: PullRequest[] }>("/prs/command-center");
      const parseLabels = (prs: any[]) => prs.map(pr => ({ ...pr, labels: typeof pr.labels === 'string' ? JSON.parse(pr.labels) : pr.labels }));
      return {
        fresh: parseLabels(data.fresh),
        aging: parseLabels(data.aging),
        stale: parseLabels(data.stale),
      };
    },
  },
  activity: {
    getLiveStream: async () => {
      const { data } = await apiClient.get<ActivityEvent[]>("/activity");
      return data;
    },
  },
  team: {
    getLeaderboard: async () => {
      const { data } = await apiClient.get<DeveloperMetric[]>("/team/leaderboard");
      return data;
    },
  },
  analytics: {
    getSprints: async () => {
      const { data } = await apiClient.get<SprintData[]>("/analytics/sprints");
      return data;
    },
    getLeadTime: async () => {
      const { data } = await apiClient.get<{ range: string; count: number; pct: number }[]>("/analytics/lead-time");
      return data;
    },
    getCommits: async () => {
      const { data } = await apiClient.get<any>("/analytics/commits");
      return data;
    },
    getRepos: async () => {
      const { data } = await apiClient.get<any>("/analytics/repos");
      return data;
    },
  },
  integrations: {
    getGithubStatus: async (userId: string) => {
      const { data } = await apiClient.get<any>(`/integrations/github?userId=${userId}`);
      return data;
    },
  },
  sync: {
    trigger: async (userId: string) => {
      const { data } = await apiClient.post<any>(`/sync/trigger?userId=${userId}`);
      return data;
    },
  },
  actions: {
    suggestRefactor: async (insightId: string) => {
      const { data } = await apiClient.post<{ success: boolean; suggestion: string }>("/actions/suggest-refactor", { insightId });
      return data;
    },
    createIssue: async (userId: string, repoId: string, title: string, body: string) => {
      const { data } = await apiClient.post<{ success: boolean; url: string }>("/actions/create-issue", { userId, repoId, title, body });
      return data;
    },
    draftPrSummary: async (pullRequestId: string) => {
      const { data } = await apiClient.post<{ success: boolean; summary: string }>("/actions/draft-pr-summary", { pullRequestId });
      return data;
    },
  },
};
