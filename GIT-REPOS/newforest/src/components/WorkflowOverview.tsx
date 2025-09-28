import React from 'react';
import { Play, Pause, MoreHorizontal, Clock, User, Tag } from 'lucide-react';
import { Workflow } from '../types';

interface WorkflowOverviewProps {
  workflows: Workflow[];
  onWorkflowClick: (workflowId: string) => void;
}

export function WorkflowOverview({ workflows, onWorkflowClick }: WorkflowOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'paused':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-400';
      case 'high':
        return 'text-amber-400';
      case 'medium':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="heading-3">Active Workflows</h3>
        <button 
          className="button-secondary text-sm"
          style={{ color: 'var(--color-accent-primary)' }}
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            onClick={() => onWorkflowClick(workflow.id)}
            className="p-4 border rounded-xl cursor-pointer transition-all duration-200 group hover:shadow-md"
            style={{ 
              background: 'var(--bg-secondary)', 
              borderColor: 'var(--border-primary)' 
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 
                    className="font-medium transition-colors body-text"
                    style={{ 
                      color: 'var(--text-primary)',
                      ':hover': { color: 'var(--color-accent-primary)' }
                    }}
                  >
                    {workflow.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
                    {workflow.status}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                    {workflow.priority.toUpperCase()}
                  </span>
                </div>
                <p className="small-text mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {workflow.description}
                </p>
              </div>
              <button className="p-1 text-slate-400 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(workflow.progress)}%</span>
              </div>
              <div className="w-full bg-slate-600/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${workflow.progress}%` }}
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{workflow.actualDuration || workflow.estimatedDuration}min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>System</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {workflow.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}