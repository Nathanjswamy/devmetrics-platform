export function getMetricIntelligence(type, value) {
  // Mock trend data logic based on realistic thresholds
  switch (type) {
    case 'leadTime':
      if (value > 48) {
        return {
          trend: '+12%',
          status: 'warning',
          interpretation: 'Lead time increased due to slower PR review cycles.',
          recommendation: 'Reduce PR size to improve review turnaround.'
        };
      }
      return {
        trend: '-4%',
        status: 'success',
        interpretation: 'PR reviews are moving quickly and efficiently.',
        recommendation: 'Maintain current chunk sizes.'
      };

    case 'cycleTime':
      if (value > 120) {
        return {
          trend: '+18%',
          status: 'warning',
          interpretation: 'Issue completion is dragging, suggesting blocked tasks.',
          recommendation: 'Review daily standup blockers.'
        };
      }
      return {
        trend: '-2%',
        status: 'success',
        interpretation: 'Steady issue resolution pace across the board.',
        recommendation: 'Continue current sprint cadence.'
      };

    case 'deploymentFreq':
      if (value < 4) {
        return {
          trend: '-25%',
          status: 'error',
          interpretation: 'Deployments have slowed, increasing batch risk.',
          recommendation: 'Move towards smaller, continuous deployments.'
        };
      }
      return {
        trend: '+10%',
        status: 'success',
        interpretation: 'Frequent deployments are keeping batch risk low.',
        recommendation: 'Maintain continuous delivery pipeline.'
      };

    case 'bugRate':
      if (value > 15) {
        return {
          trend: '+8%',
          status: 'error',
          interpretation: 'Recent releases introduced a high defect rate.',
          recommendation: 'Implement stricter automated testing before merge.'
        };
      }
      return {
        trend: '-5%',
        status: 'success',
        interpretation: 'Code quality is stable with minimal regressions.',
        recommendation: 'Current QA processes are effective.'
      };

    case 'prThroughput':
      if (value < 20) {
        return {
          trend: '-15%',
          status: 'warning',
          interpretation: 'Merge velocity has dropped significantly.',
          recommendation: 'Investigate if reviewers are overloaded.'
        };
      }
      return {
        trend: '+22%',
        status: 'success',
        interpretation: 'High merge velocity indicating strong momentum.',
        recommendation: 'Ensure code quality isn\'t sacrificed for speed.'
      };

    default:
      return {
        trend: '0%',
        status: 'neutral',
        interpretation: 'Metric is stable.',
        recommendation: 'Monitor for changes.'
      };
  }
}
