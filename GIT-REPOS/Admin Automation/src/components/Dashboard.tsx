import React from 'react';
import { KPI, Workflow } from '../types';
import { KPICard } from './KPICard';
import { WorkflowOverview } from './WorkflowOverview';
import { ActivityFeed } from './ActivityFeed';
import { SystemHealth } from './SystemHealth';
import { Plus, Zap, Activity, FileBarChart } from 'lucide-react';

interface DashboardProps {
  kpis: KPI[];
  workflows: Workflow[];
  onWorkflowClick: (workflowId: string) => void;
  onStartAnalysis: () => void;
}

export function Dashboard({ kpis, workflows, onWorkflowClick, onStartAnalysis }: DashboardProps) {
  const activeWorkflows = workflows.filter(w => w.status === 'active');
  const recentWorkflows = workflows.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AdminFlow Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's your automation overview for today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Tasks Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Task Analysis & Automation Planning</h2>
              <p className="text-gray-600 text-sm">
                Identify and prioritize tasks for AI automation - enhancing your team's capabilities
              </p>
            </div>
            <button 
              onClick={onStartAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Start Analysis
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-800">Inventory Tasks</h3>
              </div>
              <p className="text-sm text-gray-600">
                Catalog your team's daily, weekly, and monthly administrative tasks
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-800">Prioritize Impact</h3>
              </div>
              <p className="text-sm text-gray-600">
                Identify high-volume, time-consuming tasks that could benefit from AI assistance
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-800">Plan Automation</h3>
              </div>
              <p className="text-sm text-gray-600">
                Design AI-enhanced workflows that empower your team to focus on strategic work
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Workflows */}
        <div className="lg:col-span-2">
          <WorkflowOverview 
            workflows={recentWorkflows} 
            onWorkflowClick={onWorkflowClick}
          />
        </div>

        {/* System Health */}
        <div>
          <SystemHealth />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Feed */}
        <ActivityFeed />
        
        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="heading-3 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:border-solid group text-left"
              style={{ 
                borderColor: 'var(--color-accent-primary)',
                background: 'var(--status-info-bg)'
              }}
            >
              <Plus 
                className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" 
                style={{ color: 'var(--color-accent-primary)' }}
              />
              <div className="small-text font-medium" style={{ color: 'var(--color-accent-primary)' }}>
                Create Workflow
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Build new automation
              </div>
            </button>

            <button 
              className="p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:border-solid group text-left"
              style={{ 
                borderColor: 'var(--color-accent-secondary)',
                background: 'var(--status-success-bg)'
              }}
            >
              <Zap 
                className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" 
                style={{ color: 'var(--color-accent-secondary)' }}
              />
              <div className="small-text font-medium" style={{ color: 'var(--color-accent-secondary)' }}>
                Add Integration
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Connect new service
              </div>
            </button>

            <button 
              className="p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:border-solid group text-left"
              style={{ 
                borderColor: 'var(--color-accent-warning)',
                background: 'var(--status-warning-bg)'
              }}
            >
              <Activity 
                className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" 
                style={{ color: 'var(--color-accent-warning)' }}
              />
              <div className="small-text font-medium" style={{ color: 'var(--color-accent-warning)' }}>
                Run Diagnostics
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Check system health
              </div>
            </button>

            <button 
              className="p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:border-solid group text-left"
              style={{ 
                borderColor: '#8b5cf6',
                background: '#f3f4f6'
              }}
            >
              <FileBarChart 
                className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" 
                style={{ color: '#8b5cf6' }}
              />
              <div className="small-text font-medium" style={{ color: '#8b5cf6' }}>
                Generate Report
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Export analytics
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}