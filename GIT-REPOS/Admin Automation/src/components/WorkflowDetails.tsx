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
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'running':
        return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 border-2 border-gray-400 rounded-full" />;
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'api':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ai':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'decision':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'notification':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'document':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workflow.name}</h1>
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onExecute}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors text-lg font-semibold shadow-lg"
          >
            <Play className="h-5 w-5" />
            <span>SIMULATE</span>
          </button>
        </div>
      </div>

      {/* Workflow Explanation */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <h3 className="text-gray-900 font-medium">How This Workflow Works</h3>
        </div>
        <p className="text-gray-700 text-sm">
          When the trigger event occurs, these {workflow.steps.length} steps will run automatically in sequence. 
          Click <strong>SIMULATE</strong> above to see exactly what happens!
        </p>
      </div>

      {/* Workflow Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-semibold mb-4">Workflow Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                workflow.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                workflow.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                workflow.status === 'failed' ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {workflow.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Priority:</span>
              <span className={`text-sm font-medium ${
                workflow.priority === 'critical' ? 'text-red-600' :
                workflow.priority === 'high' ? 'text-amber-600' :
                workflow.priority === 'medium' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {workflow.priority.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Progress:</span>
              <span className="text-gray-900 font-medium">{Math.round(workflow.progress)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-semibold mb-4">Timing</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estimated:</span>
              <span className="text-gray-900">{workflow.estimatedDuration}min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Actual:</span>
              <span className="text-gray-900">{workflow.actualDuration || 'In progress'}min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900">{formatDate(workflow.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-semibold mb-4">Triggers</h3>
          <div className="space-y-2">
            {workflow.triggers.map((trigger, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700 text-sm">{trigger}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-semibold mb-4">Overall Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-4 rounded-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${workflow.progress}%` }}
          >
            <span className="text-white text-xs font-medium">{Math.round(workflow.progress)}%</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-semibold mb-4">Workflow Steps</h3>
        <p className="text-gray-600 text-sm mb-6">
          These steps will execute automatically when triggered:
        </p>
        <div className="space-y-4">
          {workflow.steps.map((step, index) => (
            <div key={step.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-gray-900 font-medium">{step.name}</h4>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStepTypeColor(step.type)}`}>
                        {step.type}
                      </span>
                      {getStepStatusIcon(step.status)}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {step.config?.description || `${step.type} step`}
                  </p>
                  
                  {/* Enhanced step details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <div className="text-gray-500 mb-1">⏱️ Duration</div>
                      <div className="text-gray-700">{step.config?.estimatedTime || '2-3 days'}</div>
                    </div>
                    
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <div className="text-gray-500 mb-1">🔄 Trigger</div>
                      <div className="text-gray-700">{step.config?.trigger || 'Manual trigger'}</div>
                    </div>
                    
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <div className="text-gray-500 mb-1">⚡ Condition</div>
                      <div className="text-gray-700">{step.config?.condition || 'Always run this step'}</div>
                    </div>
                  </div>
                  
                  {/* Wait time indicator */}
                  {step.config?.waitTime && step.config.waitTime !== '0 seconds' && (
                    <div className="mt-3 flex items-center space-x-2 text-xs text-amber-600">
                      <Clock className="h-3 w-3" />
                      <span>Waits {step.config.waitTime} before next step</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Connection line to next step */}
              {index < workflow.steps.length - 1 && (
                <div className="flex justify-center mt-3">
                  <div className="w-px h-4 bg-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-emerald-700 text-sm text-center">
            💡 Click <strong>SIMULATE</strong> above to see these steps in action!
          </p>
        </div>
      </div>



      {/* Tags */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-semibold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {workflow.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center space-x-1 border border-blue-200"
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