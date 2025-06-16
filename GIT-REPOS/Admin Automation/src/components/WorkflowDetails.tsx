import React from 'react';
import { ArrowLeft, Play, Pause, Square, Clock, User, Tag, CheckCircle, AlertCircle, Loader, Zap, Info } from 'lucide-react';
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

  const getStepTypeDisplay = (type: string) => {
    switch (type) {
      case 'api':
        return { label: 'Automation', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🤖' };
      case 'ai':
        return { label: 'AI Processing', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🧠' };
      case 'decision':
        return { label: 'Decision Point', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🤔' };
      case 'notification':
        return { label: 'Send Message', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '📧' };
      case 'document':
        return { label: 'Create Document', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '📄' };
      default:
        return { label: 'Task', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '⚙️' };
    }
  };

  const getSimpleStepDescription = (stepName: string, stepType: string) => {
    // Extract the main task from the step name
    const taskName = stepName.replace('Automate: ', '').toLowerCase();
    
    if (taskName.includes('insurance') && taskName.includes('claim')) {
      return 'Automatically processes insurance claims from start to finish - reads documents, extracts information, and updates your system.';
    }
    if (taskName.includes('email') && taskName.includes('template')) {
      return 'Creates and manages email templates automatically - updates content, personalises messages, and keeps everything organised.';
    }
    if (taskName.includes('invoice')) {
      return 'Handles invoice processing automatically - reads invoices, extracts data, and updates your accounting system.';
    }
    if (taskName.includes('customer') || taskName.includes('client')) {
      return 'Manages customer information automatically - updates records, sends communications, and tracks interactions.';
    }
    if (taskName.includes('document')) {
      return 'Processes documents automatically - reads content, extracts important information, and files everything properly.';
    }
    if (taskName.includes('appointment') || taskName.includes('scheduling')) {
      return 'Handles appointment scheduling automatically - checks availability, books slots, and sends confirmations.';
    }
    if (taskName.includes('payment') || taskName.includes('billing')) {
      return 'Manages payments and billing automatically - processes transactions, sends invoices, and tracks payments.';
    }
    
    // Default description
    return 'This automation handles the task automatically, saving you time and reducing manual work.';
  };

  const getRealisticDuration = (stepName: string) => {
    const taskName = stepName.replace('Automate: ', '').toLowerCase();
    
    if (taskName.includes('insurance') && taskName.includes('claim')) {
      return '2-3 weeks to set up';
    }
    if (taskName.includes('email') && taskName.includes('template')) {
      return '3-5 days to set up';
    }
    if (taskName.includes('invoice')) {
      return '1-2 weeks to set up';
    }
    if (taskName.includes('customer') || taskName.includes('client')) {
      return '1-2 weeks to set up';
    }
    if (taskName.includes('document')) {
      return '1-2 weeks to set up';
    }
    if (taskName.includes('appointment') || taskName.includes('scheduling')) {
      return '3-5 days to set up';
    }
    if (taskName.includes('payment') || taskName.includes('billing')) {
      return '1-2 weeks to set up';
    }
    
    return '1-2 weeks to set up';
  };

  const getWhenItRuns = (trigger: string) => {
    if (trigger === 'manual') return 'When you click the start button';
    if (trigger.includes('email')) return 'When an email arrives';
    if (trigger.includes('form')) return 'When someone submits a form';
    if (trigger.includes('schedule')) return 'At scheduled times';
    if (trigger.includes('file')) return 'When a file is uploaded';
    return 'When the trigger event happens';
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg flex items-center space-x-3 transition-colors text-xl font-bold shadow-lg"
          >
            <Play className="h-6 w-6" />
            <span>TEST THIS WORKFLOW</span>
          </button>
        </div>
      </div>

      {/* What This Does - Big Clear Explanation */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Info className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">What This Workflow Does</h3>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          This workflow contains <strong>{workflow.steps.length} automated tasks</strong> that will run one after another. 
          Once you start it, everything happens automatically - no more manual work needed! 
          Click <strong>"TEST THIS WORKFLOW"</strong> above to see exactly how it works.
        </p>
      </div>

      {/* Simplified Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-bold mb-4 text-lg">Current Status</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border-2 ${
                workflow.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                workflow.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                workflow.status === 'failed' ? 'bg-red-100 text-red-700 border-red-300' :
                'bg-gray-100 text-gray-700 border-gray-300'
              }`}>
                {workflow.status === 'draft' ? 'Ready to Start' : 
                 workflow.status === 'active' ? 'Currently Running' :
                 workflow.status === 'completed' ? 'Finished' :
                 workflow.status === 'failed' ? 'Had a Problem' : workflow.status}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{Math.round(workflow.progress)}%</div>
              <div className="text-gray-600">Complete</div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-bold mb-4 text-lg">Setup Time</h3>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor(workflow.estimatedDuration / 60)} hours
              </div>
              <div className="text-gray-600">to set up completely</div>
            </div>
            <div className="text-sm text-gray-600 text-center">
              Created on {formatDate(workflow.createdAt)}
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-bold mb-4 text-lg">How It Starts</h3>
          <div className="space-y-3">
            {workflow.triggers.map((trigger, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-blue-700 font-medium text-center">
                  {getWhenItRuns(trigger)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-4 text-lg">Overall Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-6 mb-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${workflow.progress}%` }}
          >
            <span className="text-white text-sm font-bold">{Math.round(workflow.progress)}%</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Not Started</span>
          <span>Half Done</span>
          <span>Completed</span>
        </div>
      </div>

      {/* Workflow Steps - Much Clearer */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-4 text-xl">The Automated Tasks</h3>
        <p className="text-gray-600 text-lg mb-6">
          Here's what happens automatically when this workflow runs:
        </p>
        <div className="space-y-6">
          {workflow.steps.map((step, index) => {
            const stepDisplay = getStepTypeDisplay(step.type);
            return (
              <div key={step.id} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-900">{step.name}</h4>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${stepDisplay.color} flex items-center space-x-1`}>
                          <span>{stepDisplay.icon}</span>
                          <span>{stepDisplay.label}</span>
                        </span>
                        {getStepStatusIcon(step.status)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                      {getSimpleStepDescription(step.name, step.type)}
                    </p>
                    
                    {/* What Happens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                        <div className="text-blue-600 font-bold mb-2 flex items-center space-x-2">
                          <span>⏱️</span>
                          <span>Setup Time</span>
                        </div>
                        <div className="text-gray-700 font-medium">{getRealisticDuration(step.name)}</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200">
                        <div className="text-emerald-600 font-bold mb-2 flex items-center space-x-2">
                          <span>🚀</span>
                          <span>When It Runs</span>
                        </div>
                        <div className="text-gray-700 font-medium">
                          {index === 0 ? getWhenItRuns(workflow.triggers[0] || 'manual') : 'After the previous task finishes'}
                        </div>
                      </div>
                    </div>
                    
                    {/* What You Get */}
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <div className="text-emerald-700 font-bold mb-2 flex items-center space-x-2">
                        <span>✅</span>
                        <span>What You Get</span>
                      </div>
                      <div className="text-emerald-700">
                        No more manual work for this task - it all happens automatically!
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connection arrow to next step */}
                {index < workflow.steps.length - 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex flex-col items-center">
                      <div className="w-px h-6 bg-gray-300"></div>
                      <div className="text-gray-400 text-sm">then</div>
                      <div className="w-px h-6 bg-gray-300"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-emerald-700 text-lg font-bold mb-2">
              Ready to see this in action?
            </p>
            <p className="text-gray-700 mb-4">
              Click the big green button at the top to test this workflow and see exactly how it works!
            </p>
            <button
              onClick={onExecute}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              TEST THIS WORKFLOW
            </button>
          </div>
        </div>
      </div>

      {/* Tags - Simplified */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-4 text-lg">Related To</h3>
        <div className="flex flex-wrap gap-3">
          {workflow.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border-2 border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}