import React, { useState } from 'react';
import { Play, Pause, Square, Edit, Trash2, Plus, Filter, Search, Zap } from 'lucide-react';
import { Workflow } from '../types';
import { WorkflowDetails } from './WorkflowDetails';
import { WorkflowBuilder } from './WorkflowBuilder';
import { WorkflowExecutor } from './WorkflowExecutor';

interface WorkflowManagerProps {
  workflows: Workflow[];
  onWorkflowExecute: (id: string) => void;
  onWorkflowSave?: (workflow: Workflow) => void;
}

export function WorkflowManager({ workflows, onWorkflowExecute, onWorkflowSave }: WorkflowManagerProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [executingWorkflow, setExecutingWorkflow] = useState<Workflow | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || workflow.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const handleCreateWorkflow = (workflow: Workflow) => {
    onWorkflowSave?.(workflow);
    setShowBuilder(false);
  };

  const handleExecuteWorkflow = (workflow: Workflow) => {
    setExecutingWorkflow(workflow);
    setShowBuilder(false);
  };

  const handleExecutionComplete = (completedWorkflow: Workflow) => {
    onWorkflowSave?.(completedWorkflow);
    setExecutingWorkflow(null);
  };

  // Show workflow executor
  if (executingWorkflow) {
    return (
      <WorkflowExecutor
        workflow={executingWorkflow}
        onBack={() => setExecutingWorkflow(null)}
        onComplete={handleExecutionComplete}
      />
    );
  }

  // Show workflow builder
  if (showBuilder) {
    return (
      <WorkflowBuilder
        onSave={handleCreateWorkflow}
        onExecute={handleExecuteWorkflow}
      />
    );
  }

  // Show workflow details
  if (selectedWorkflow) {
    const workflow = workflows.find(w => w.id === selectedWorkflow);
    if (workflow) {
      return (
        <WorkflowDetails
          workflow={workflow}
          onBack={() => setSelectedWorkflow(null)}
          onExecute={() => onWorkflowExecute(workflow.id)}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Workflow Manager</h1>
          <p className="text-slate-400 mt-1">
            Create, manage, and monitor your automated workflows
          </p>
        </div>
        <button 
          onClick={() => setShowBuilder(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Workflow</span>
        </button>
      </div>

      {/* What is a Workflow Explanation */}
      <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="h-6 w-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Understanding Workflows</h3>
        </div>
        <div className="mb-4">
          <p className="text-slate-300 text-sm mb-3">
            A workflow is a series of steps that happen automatically when a <strong>trigger event</strong> occurs.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Common Trigger Events:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-300">
              <div>📧 Email received</div>
              <div>📝 Form submitted</div>
              <div>📅 Scheduled time</div>
              <div>💰 Payment made</div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            👆 Click any workflow below to see its steps, then use <strong>SIMULATE</strong> to test it
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800/50 border border-slate-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200 group cursor-pointer"
            onClick={() => setSelectedWorkflow(workflow.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {workflow.name}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
                    {workflow.status}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                    {workflow.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExecutingWorkflow(workflow);
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors"
                title="Test this workflow"
              >
                <Play className="h-3 w-3" />
                <span>SIMULATE</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {workflow.description}
            </p>

            {/* Steps Preview */}
            <div className="mb-4">
              <h4 className="text-white text-sm font-medium mb-2">Workflow Steps:</h4>
              <div className="space-y-1">
                {workflow.steps.slice(0, 3).map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-2 text-xs">
                    <div className="w-4 h-4 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-slate-300 truncate">{step.name}</span>
                  </div>
                ))}
                {workflow.steps.length > 3 && (
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-4 h-4 bg-slate-600/50 text-slate-400 rounded-full flex items-center justify-center text-xs">
                      +
                    </div>
                    <span className="text-slate-400">{workflow.steps.length - 3} more steps</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
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

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{workflow.steps.length} steps</span>
              <span>{workflow.actualDuration || workflow.estimatedDuration}min</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {workflow.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-slate-600/30 text-slate-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No workflows found matching your criteria</p>
            <button 
              onClick={() => setShowBuilder(true)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Workflow</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}