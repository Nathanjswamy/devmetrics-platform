import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  TerminalSquare, 
  Check, 
  ChevronRight, 
  ShieldAlert,
  FolderOpen,
  GitBranch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_ISSUES = [
  {
    id: 'issue-1',
    title: 'Sensitive Database Files in Source Control',
    priority: 'CRITICAL',
    category: 'Security',
    repo: 'devmetrics-platform',
    description: 'SQLite database files (.db, .sqlite) are committed directly to the Git repository. This exposes potential sensitive data and bloats the repository size.',
    icon: ShieldAlert,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/50',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    steps: [
      {
        id: 'step-1-1',
        title: 'Update .gitignore',
        code: `echo '*.sqlite' >> .gitignore && echo '*.db' >> .gitignore`
      },
      {
        id: 'step-1-2',
        title: 'Remove files from Git tracking',
        code: `git rm -r --cached .`
      },
      {
        id: 'step-1-3',
        title: 'Commit the security fix',
        code: `git commit -m 'chore: remove sensitive sqlite db files'`
      }
    ]
  },
  {
    id: 'issue-2',
    title: 'Empty Repository - Lack of Functional Content',
    priority: 'CRITICAL',
    category: 'Project',
    repo: 'Nathanjswamy',
    description: 'The repository currently contains only a README.md file and no functional code. It needs to be initialized with an actual project codebase.',
    icon: FolderOpen,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/50',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]',
    steps: [
      {
        id: 'step-2-1',
        title: 'Initialize Git in a local functional project (e.g., City Agent)',
        code: `git init && git add . && git commit -m 'Initial commit'`
      },
      {
        id: 'step-2-2',
        title: 'Force push to the empty repository',
        code: `git branch -M main && git remote add origin <repo-url> && git push -u origin main`
      }
    ]
  }
];

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-md transition-colors border flex items-center justify-center ${
        copied 
          ? 'bg-green-500/20 border-green-500/50 text-green-400' 
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
      }`}
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
};

export const ActionableResolutionCenter = () => {
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [activeIssueId, setActiveIssueId] = useState(INITIAL_ISSUES[0].id);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [resolvedIssues, setResolvedIssues] = useState(new Set());

  const activeIssue = issues.find(i => i.id === activeIssueId);

  const handleStepToggle = (issueId, stepId) => {
    setCheckedSteps(prev => ({
      ...prev,
      [`${issueId}-${stepId}`]: !prev[`${issueId}-${stepId}`]
    }));
  };

  const isStepChecked = (issueId, stepId) => {
    return !!checkedSteps[`${issueId}-${stepId}`];
  };

  const areAllStepsChecked = (issue) => {
    if (!issue) return false;
    return issue.steps.every(step => isStepChecked(issue.id, step.id));
  };

  const handleMarkResolved = (issueId) => {
    setResolvedIssues(prev => {
      const next = new Set(prev);
      next.add(issueId);
      return next;
    });
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full bg-slate-950 text-slate-200 overflow-hidden rounded-xl border border-slate-800 shadow-2xl font-sans">
      
      {/* Left Pane: Issue List */}
      <div className="w-1/3 min-w-[320px] max-w-[400px] bg-slate-900 border-r border-slate-800 flex flex-col z-10">
        <div className="p-5 border-b border-slate-800 bg-slate-900/50 sticky top-0 backdrop-blur-sm z-20">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="text-indigo-400" size={22} />
            Resolution Center
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {issues.length - resolvedIssues.size} pending issues require your attention
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {issues.map(issue => {
            const isResolved = resolvedIssues.has(issue.id);
            const isActive = activeIssueId === issue.id;
            const Icon = issue.icon;
            
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveIssueId(issue.id)}
                className={`relative cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                  isActive 
                    ? `bg-slate-800 ${issue.border} ${!isResolved && issue.glow}` 
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                } ${isResolved ? 'opacity-50 grayscale' : ''}`}
              >
                {isResolved && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] rounded-lg z-10 flex items-center justify-center">
                    <div className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                      <CheckCircle2 size={16} className="text-green-400" />
                      <span className="text-sm font-medium text-slate-200">Resolved</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <div className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full ${issue.bg} ${issue.color} border ${issue.border}`}>
                    <Icon size={12} />
                    {issue.priority} | {issue.category}
                  </div>
                </div>
                
                <h3 className={`font-medium text-[15px] leading-tight mb-2 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {issue.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/50 inline-flex px-2 py-1 rounded">
                  <GitBranch size={12} />
                  {issue.repo}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Resolution Workspace */}
      <div className="flex-1 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 flex flex-col relative overflow-hidden">
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <AnimatePresence mode="wait">
          {activeIssue && (
            <motion.div 
              key={activeIssue.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto flex flex-col"
            >
              
              {/* Header */}
              <div className="p-8 border-b border-slate-800 bg-slate-900/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${activeIssue.bg} ${activeIssue.color} border ${activeIssue.border}`}>
                    <activeIssue.icon size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                      <GitBranch size={16} />
                      <span className="font-mono">{activeIssue.repo}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      {activeIssue.title}
                    </h1>
                  </div>
                </div>
                
                <p className="text-slate-300 leading-relaxed max-w-3xl text-[15px]">
                  {activeIssue.description}
                </p>
              </div>

              {/* Action Plan */}
              <div className="p-8 flex-1">
                <div className="flex items-center gap-2 mb-6">
                  <TerminalSquare className="text-indigo-400" size={20} />
                  <h2 className="text-lg font-semibold text-white">Action Plan</h2>
                </div>

                <div className="space-y-6 max-w-4xl">
                  {activeIssue.steps.map((step, index) => {
                    const checked = isStepChecked(activeIssue.id, step.id);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={step.id} 
                        className={`relative rounded-xl border p-5 transition-all duration-300 ${
                          checked 
                            ? 'bg-slate-800/30 border-slate-700/50 opacity-60' 
                            : 'bg-slate-800/80 border-slate-700 shadow-lg'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <button 
                            onClick={() => handleStepToggle(activeIssue.id, step.id)}
                            className={`mt-0.5 shrink-0 flex items-center justify-center w-6 h-6 rounded-md border transition-all duration-200 ${
                              checked 
                                ? 'bg-indigo-500 border-indigo-500 text-white' 
                                : 'bg-slate-900 border-slate-600 hover:border-indigo-400'
                            }`}
                          >
                            {checked && <Check size={14} strokeWidth={3} />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium mb-3 ${checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                              Step {index + 1}: {step.title}
                            </h3>
                            
                            <div className="flex gap-2 items-start relative group">
                              <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-4 overflow-x-auto">
                                <code className="font-mono text-sm text-emerald-400 whitespace-pre">
                                  {step.code}
                                </code>
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <CopyButton text={step.code} />
                              </div>
                              {/* Visible button for touch/no-hover */}
                              <div className="md:hidden">
                                <CopyButton text={step.code} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {/* Footer with Resolve Button */}
              <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md flex justify-end sticky bottom-0">
                <button
                  disabled={!areAllStepsChecked(activeIssue) || resolvedIssues.has(activeIssue.id)}
                  onClick={() => handleMarkResolved(activeIssue.id)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-500 text-white disabled:hover:bg-indigo-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:hover:shadow-none"
                >
                  {resolvedIssues.has(activeIssue.id) ? (
                    <>
                      <CheckCircle2 size={18} />
                      Resolved
                    </>
                  ) : (
                    <>
                      Mark as Resolved
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
