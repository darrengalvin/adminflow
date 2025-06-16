import React from 'react';
import { ArrowLeft, Play, Pause, Square, Clock, User, Tag, CheckCircle, AlertCircle, Loader, Zap } from 'lucide-react';
import { Workflow } from '../types';

interface WorkflowDetailsProps {
  workflow: Workflow;
  onBack: () => void;
  onExecute: () => void;
}

export function WorkflowDetails({ workflow, onBack, onExecute }: WorkflowDetailsProps) {
  // Safe date formatting function
  const formatDate = (dateValue: any): string => {
    try {
      if (!dateValue) return 'Unknown';
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error, 'for value:', dateValue);
      return 'Invalid Date';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'running':
        return <Loader className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <div className="h-5 w-5 border-2 border-slate-500 rounded-full" />;
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'api':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ai':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'decision':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'notification':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'document':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{workflow.name}</h1>
            <p className="text-slate-400 mt-1">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onExecute}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors text-lg font-semibold"
          >
            <Play className="h-5 w-5" />
            <span>SIMULATE</span>
          </button>
        </div>
      </div>

      {/* Workflow Explanation */}
      <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="h-5 w-5 text-blue-400" />
          <h3 className="text-white font-medium">How This Workflow Works</h3>
        </div>
        <p className="text-slate-300 text-sm">
          When the trigger event occurs, these {workflow.steps.length} steps will run automatically in sequence. 
          Click <strong>SIMULATE</strong> above to see exactly what happens!
        </p>
      </div>

      {/* Workflow Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Workflow Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                workflow.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                workflow.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                workflow.status === 'failed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                'bg-slate-500/20 text-slate-400 border-slate-500/30'
              }`}>
                {workflow.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Priority:</span>
              <span className={`text-sm font-medium ${
                workflow.priority === 'critical' ? 'text-red-400' :
                workflow.priority === 'high' ? 'text-amber-400' :
                workflow.priority === 'medium' ? 'text-blue-400' :
                'text-slate-400'
              }`}>
                {workflow.priority.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Progress:</span>
              <span className="text-white font-medium">{Math.round(workflow.progress)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Timing</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Estimated:</span>
              <span className="text-white">{workflow.estimatedDuration}min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Actual:</span>
              <span className="text-white">{workflow.actualDuration || 'In progress'}min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Created:</span>
              <span className="text-white">{formatDate(workflow.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Triggers</h3>
          <div className="space-y-2">
            {workflow.triggers.map((trigger, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">{trigger}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Overall Progress</h3>
        <div className="w-full bg-slate-600/50 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-4 rounded-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${workflow.progress}%` }}
          >
            <span className="text-white text-xs font-medium">{Math.round(workflow.progress)}%</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-slate-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Workflow Steps</h3>
        <p className="text-slate-400 text-sm mb-6">
          These steps will execute automatically when triggered:
        </p>
        <div className="space-y-4">
          {workflow.steps.map((step, index) => (
            <div key={step.id} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{step.name}</h4>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStepTypeColor(step.type)}`}>
                        {step.type}
                      </span>
                      {getStepStatusIcon(step.status)}
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-3">
                    {step.config?.description || `${step.type} step`}
                  </p>
                  
                  {/* Enhanced step details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-slate-500 mb-1">⏱️ Duration</div>
                      <div className="text-slate-300">{step.config?.estimatedTime || '5 minutes'}</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-slate-500 mb-1">🔄 Trigger</div>
                      <div className="text-slate-300">{step.config?.trigger || 'Previous step completes'}</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-slate-500 mb-1">⚡ Condition</div>
                      <div className="text-slate-300">{step.config?.condition || 'Always run'}</div>
                    </div>
                  </div>
                  
                  {/* Wait time indicator */}
                  {step.config?.waitTime && step.config.waitTime !== '0 seconds' && (
                    <div className="mt-3 flex items-center space-x-2 text-xs text-amber-400">
                      <Clock className="h-3 w-3" />
                      <span>Waits {step.config.waitTime} before next step</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Connection line to next step */}
              {index < workflow.steps.length - 1 && (
                <div className="flex justify-center mt-3">
                  <div className="w-px h-4 bg-slate-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <p className="text-emerald-300 text-sm text-center">
            💡 Click <strong>SIMULATE</strong> above to see these steps in action!
          </p>
        </div>
      </div>

      {/* AI Suggestions for Next Steps */}
      {(workflow as any).aiSuggestions && (workflow as any).aiSuggestions.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <span>🤖</span>
            <span>AI Suggests These Next Steps</span>
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Based on your current workflow, here are some intelligent next steps you might want to add:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(workflow as any).aiSuggestions.map((suggestion: any, index: number) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{suggestion.icon}</span>
                  <h4 className="text-white font-medium text-sm">{suggestion.name}</h4>
                </div>
                <p className="text-slate-400 text-xs mb-3">{suggestion.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="text-slate-300">{suggestion.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Trigger:</span>
                    <span className="text-slate-300 text-right">{suggestion.trigger}</span>
                  </div>
                  <div className="text-slate-500 text-xs">
                    <strong>Condition:</strong> {suggestion.condition}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm text-center">
              💡 These suggestions are based on common workflow patterns for your type of automation
            </p>
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {workflow.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-slate-600/30 text-slate-300 text-sm rounded-full flex items-center space-x-1"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}