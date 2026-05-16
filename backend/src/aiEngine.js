class AIEngine {
  generateInsights(metrics, trendData) {
    const insights = [];
    const recommendations = [];
    let healthScore = 100;
    let bottleneck = null;

    // 1. Analyze Lead Time & PR Throughput
    if (metrics.leadTimeHours > 48) {
      healthScore -= 15;
      bottleneck = 'Review Process';
      insights.push({
        title: 'Review Bottleneck Detected',
        description: `Lead time has increased to ${metrics.leadTimeHours} hours. PRs are taking longer to merge, suggesting code reviews are piling up or PR sizes are too large.`,
        type: 'warning'
      });
      recommendations.push({
        title: 'Reduce PR Batch Size',
        description: 'Encourage the team to break down large PRs into smaller, reviewable chunks to reduce lead time and unblock reviewers.',
        impact: 'High'
      });
    }

    // 2. Analyze Deployment Frequency vs Bug Rate
    if (metrics.bugRatePercentage > 15) {
      healthScore -= 20;
      bottleneck = 'Quality Assurance';
      insights.push({
        title: 'High Defect Rate',
        description: `The bug rate is currently at ${metrics.bugRatePercentage}%. This indicates that recent deployments introduced a significant number of regressions.`,
        type: 'critical'
      });
      recommendations.push({
        title: 'Shift-Left Testing',
        description: 'Implement stricter automated testing requirements in CI before allowing PR merges.',
        impact: 'High'
      });
    } else if (metrics.deploymentFrequency < 4 && metrics.bugRatePercentage > 10) {
      healthScore -= 15;
      bottleneck = 'Release Batching';
      insights.push({
        title: 'Release Batching Risk',
        description: 'Deployments have slowed down, leading to larger release batches. This correlates with an increasing bug rate.',
        type: 'warning'
      });
      recommendations.push({
        title: 'Increase Deployment Frequency',
        description: 'Move towards continuous deployment. Smaller, more frequent releases carry significantly less risk than large batched releases.',
        impact: 'Medium'
      });
    }

    // 3. Positive Reinforcement
    if (healthScore >= 85) {
      insights.push({
        title: 'Healthy Workflow Momentum',
        description: 'Deployment frequency is stable, and bug rates are low. The team is operating at an optimal, sustainable pace.',
        type: 'success'
      });
    }

    // Ensure we always have at least one insight
    if (insights.length === 0) {
      insights.push({
        title: 'Stable Engineering Velocity',
        description: 'Metrics are within normal historical ranges. No critical bottlenecks detected.',
        type: 'info'
      });
    }

    return {
      healthScore,
      bottleneck: bottleneck || 'None Detected',
      insights,
      recommendations
    };
  }
}

module.exports = new AIEngine();
