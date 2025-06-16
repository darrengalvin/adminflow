import React, { useState } from 'react';
import { Plus, ArrowRight, Play, Save, Settings, Trash2, Copy } from 'lucide-react';
import { WorkflowStep, Workflow } from '../types';

interface WorkflowBuilderProps {
  onSave: (workflow: Workflow) => void;
  onExecute: (workflow: Workflow) => void;
}

export function WorkflowBuilder({ onSave, onExecute }: WorkflowBuilderProps) {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [showStepSelector, setShowStepSelector] = useState(false);

  const stepTemplates = [
    {
      type: 'data-input' as const,
      name: 'Collect Customer Information',
      description: 'Gather customer details from form or email',
      icon: '📝',
      fields: ['Customer Name', 'Email', 'Phone', 'Requirements']
    },
    {
      type: 'ai' as const,
      name: 'AI Document Analysis',
      description: 'Extract information from uploaded documents',
      icon: '🤖',
      fields: ['Document Type', 'Confidence Level', 'Extracted Data']
    },
    {
      type: 'api' as const,
      name: 'Create CRM Record',
      description: 'Add customer to CRM system',
      icon: '🔗',
      fields: ['CRM System', 'Record Type', 'Data Mapping']
    },
    {
      type: 'document' as const,
      name: 'Generate Contract',
      description: 'Create personalized contract document',
      icon: '📄',
      fields: ['Template', 'Variables', 'Output Format']
    },
    {
      type: 'notification' as const,
      name: 'Send Notification',
      description: 'Email or SMS notification to customer',
      icon: '📧',
      fields: ['Recipient', 'Message Template', 'Channel']
    },
    {
      type: 'decision' as const,
      name: 'Approval Decision',
      description: 'Automated or manual approval step',
      icon: '✅',
      fields: ['Decision Criteria', 'Approval Rules', 'Fallback Action']
    }
  ];

  const addStep = (template: typeof stepTemplates[0]) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: template.name,
      type: template.type,
      status: 'pending',
      config: {
        fields: template.fields,
        description: template.description,
        icon: template.icon
      }
    };
    setSteps([...steps, newStep]);
    setShowStepSelector(false);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const newSteps = [...steps];
    [newSteps[currentIndex], newSteps[newIndex]] = [newSteps[newIndex], newSteps[currentIndex]];
    setSteps(newSteps);
  };

  const handleSave = () => {
    if (!workflowName.trim()) return;

    const workflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      status: 'draft',
      priority: 'medium',
      steps: steps,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDuration: steps.length * 5,
      triggers: ['Manual'],
      tags: ['custom', 'user-created']
    };

    onSave(workflow);
  };

  const handleExecute = () => {
    if (!workflowName.trim() || steps.length === 0) return;

    const workflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      status: 'draft',
      priority: 'medium',
      steps: steps,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDuration: steps.length * 5,
      triggers: ['Manual'],
      tags: ['custom', 'user-created']
    };

    onExecute(workflow);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Create New Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Workflow Name
            </label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="e.g., Customer Onboarding Process"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Brief description of what this workflow does"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Workflow Steps</h3>
          <button
            onClick={() => setShowStepSelector(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Step</span>
          </button>
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8" />
              </div>
              <p>No steps added yet</p>
              <p className="text-sm">Click "Add Step" to start building your workflow</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex items-center space-x-4">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>

                  {/* Step Card */}
                  <div className="flex-1 bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{step.config?.icon}</span>
                        <div>
                          <h4 className="text-white font-medium">{step.name}</h4>
                          <p className="text-slate-400 text-sm">{step.config?.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveStep(step.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveStep(step.id, 'down')}
                          disabled={index === steps.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow to next step */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-2 mb-2">
                    <ArrowRight className="h-5 w-5 text-slate-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step Selector Modal */}
      {showStepSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Choose a Step Type</h3>
              <button
                onClick={() => setShowStepSelector(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stepTemplates.map((template) => (
                <button
                  key={template.type}
                  onClick={() => addStep(template)}
                  className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{template.icon}</span>
                    <h4 className="text-white font-medium">{template.name}</h4>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 2).map((field) => (
                      <span
                        key={field}
                        className="px-2 py-1 bg-slate-600/30 text-slate-300 text-xs rounded-full"
                      >
                        {field}
                      </span>
                    ))}
                    {template.fields.length > 2 && (
                      <span className="px-2 py-1 bg-slate-600/30 text-slate-300 text-xs rounded-full">
                        +{template.fields.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-slate-400 text-sm">
          {steps.length} step{steps.length !== 1 ? 's' : ''} • Estimated duration: {steps.length * 5} minutes
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={!workflowName.trim()}
            className="bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handleExecute}
            disabled={!workflowName.trim() || steps.length === 0}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>Test Run</span>
          </button>
        </div>
      </div>
    </div>
  );
}