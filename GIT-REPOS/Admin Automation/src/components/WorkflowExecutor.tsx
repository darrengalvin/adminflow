import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Square, CheckCircle, AlertCircle, Loader, Clock, ArrowRight } from 'lucide-react';
import { Workflow, WorkflowStep } from '../types';

interface WorkflowExecutorProps {
  workflow: Workflow;
  onBack: () => void;
  onComplete: (workflow: Workflow) => void;
}

export function WorkflowExecutor({ workflow, onBack, onComplete }: WorkflowExecutorProps) {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(workflow);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const currentStep = currentWorkflow.steps[currentStepIndex];
  const isLastStep = currentStepIndex === currentWorkflow.steps.length - 1;

  const addToLog = (message: string) => {
    setExecutionLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const executeStep = async (step: WorkflowStep, data: any) => {
    addToLog(`Starting step: ${step.name}`);
    
    // Update step status to running
    const updatedSteps = currentWorkflow.steps.map(s => 
      s.id === step.id ? { ...s, status: 'running' as const, startTime: new Date() } : s
    );
    setCurrentWorkflow(prev => ({ ...prev, steps: updatedSteps }));

    // Simulate step execution with realistic delay
    const executionTime = Math.random() * 3000 + 1000; // 1-4 seconds
    await new Promise(resolve => setTimeout(resolve, executionTime));

    // Simulate success/failure (90% success rate)
    const success = Math.random() > 0.1;

    if (success) {
      addToLog(`✅ Completed: ${step.name}`);
      const finalSteps = currentWorkflow.steps.map(s => 
        s.id === step.id ? { 
          ...s, 
          status: 'completed' as const, 
          endTime: new Date(),
          duration: executionTime,
          data: generateStepResult(step.type, data)
        } : s
      );
      setCurrentWorkflow(prev => ({ ...prev, steps: finalSteps }));
      return true;
    } else {
      addToLog(`❌ Failed: ${step.name} - Simulated error`);
      const finalSteps = currentWorkflow.steps.map(s => 
        s.id === step.id ? { 
          ...s, 
          status: 'failed' as const, 
          endTime: new Date(),
          duration: executionTime,
          error: 'Simulated execution error'
        } : s
      );
      setCurrentWorkflow(prev => ({ ...prev, steps: finalSteps }));
      return false;
    }
  };

  const generateStepResult = (stepType: string, inputData: any) => {
    switch (stepType) {
      case 'data-input':
        return { collected: inputData, timestamp: new Date() };
      case 'ai':
        return { 
          confidence: Math.random() * 0.3 + 0.7,
          extractedData: inputData,
          processingTime: Math.random() * 2000 + 500
        };
      case 'api':
        return { 
          success: true, 
          recordId: Math.random().toString(36).substr(2, 9),
          responseTime: Math.random() * 1000 + 200
        };
      case 'document':
        return { 
          documentId: Math.random().toString(36).substr(2, 9),
          pages: Math.floor(Math.random() * 5) + 1,
          format: 'PDF'
        };
      case 'notification':
        return { 
          sent: true, 
          channel: 'email',
          messageId: Math.random().toString(36).substr(2, 9)
        };
      case 'decision':
        return { 
          decision: Math.random() > 0.3 ? 'approved' : 'review_required',
          confidence: Math.random() * 0.4 + 0.6
        };
      default:
        return { processed: true };
    }
  };

  const handleStepSubmit = async (data: any) => {
    if (!currentStep) return;

    setStepData(prev => ({ ...prev, [currentStep.id]: data }));
    setIsExecuting(true);

    const success = await executeStep(currentStep, data);

    if (success) {
      if (isLastStep) {
        // Workflow completed
        const completedWorkflow = {
          ...currentWorkflow,
          status: 'completed' as const,
          progress: 100,
          actualDuration: Math.floor((Date.now() - currentWorkflow.createdAt.getTime()) / 60000)
        };
        setCurrentWorkflow(completedWorkflow);
        addToLog('🎉 Workflow completed successfully!');
        onComplete(completedWorkflow);
      } else {
        // Move to next step
        setCurrentStepIndex(prev => prev + 1);
        const progress = ((currentStepIndex + 1) / currentWorkflow.steps.length) * 100;
        setCurrentWorkflow(prev => ({ ...prev, progress }));
      }
    }

    setIsExecuting(false);
  };

  const getStepStatusIcon = (step: WorkflowStep, index: number) => {
    if (index < currentStepIndex) {
      return step.status === 'completed' ? 
        <CheckCircle className="h-6 w-6 text-emerald-400" /> :
        <AlertCircle className="h-6 w-6 text-red-400" />;
    } else if (index === currentStepIndex && isExecuting) {
      return <Loader className="h-6 w-6 text-blue-400 animate-spin" />;
    } else if (index === currentStepIndex) {
      return <div className="h-6 w-6 border-2 border-blue-400 rounded-full animate-pulse" />;
    } else {
      return <div className="h-6 w-6 border-2 border-slate-500 rounded-full" />;
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
            <h1 className="text-3xl font-bold text-white">{currentWorkflow.name}</h1>
            <p className="text-slate-400 mt-1">{currentWorkflow.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{Math.round(currentWorkflow.progress)}%</div>
          <div className="text-slate-400 text-sm">Complete</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Workflow Progress</h3>
          <div className="text-slate-400 text-sm">
            Step {currentStepIndex + 1} of {currentWorkflow.steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-600/50 rounded-full h-3 mb-6">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${currentWorkflow.progress}%` }}
          />
        </div>

        {/* Step Flow Visualization */}
        <div className="flex items-center justify-between">
          {currentWorkflow.steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center ${
                index <= currentStepIndex ? 'opacity-100' : 'opacity-50'
              }`}>
                {getStepStatusIcon(step, index)}
                <div className="text-xs text-slate-400 mt-2 text-center max-w-20">
                  {step.name.split(' ').slice(0, 2).join(' ')}
                </div>
              </div>
              {index < currentWorkflow.steps.length - 1 && (
                <ArrowRight className={`h-4 w-4 mx-4 ${
                  index < currentStepIndex ? 'text-emerald-400' : 'text-slate-500'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step */}
      {currentStep && currentWorkflow.status !== 'completed' && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl">{currentStep.config?.icon}</span>
            <div>
              <h3 className="text-xl font-semibold text-white">{currentStep.name}</h3>
              <p className="text-slate-400">{currentStep.config?.description}</p>
            </div>
          </div>

          <StepInputForm
            step={currentStep}
            onSubmit={handleStepSubmit}
            isExecuting={isExecuting}
            previousData={stepData}
          />
        </div>
      )}

      {/* Execution Log */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Execution Log</h3>
        <div className="bg-slate-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
          {executionLog.length === 0 ? (
            <p className="text-slate-400 text-sm">No activity yet...</p>
          ) : (
            <div className="space-y-1">
              {executionLog.map((entry, index) => (
                <div key={index} className="text-slate-300 text-sm font-mono">
                  {entry}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Completion Message */}
      {currentWorkflow.status === 'completed' && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-6 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Workflow Completed!</h3>
          <p className="text-emerald-400">
            All steps executed successfully in {currentWorkflow.actualDuration} minutes
          </p>
        </div>
      )}
    </div>
  );
}

// Step Input Form Component
interface StepInputFormProps {
  step: WorkflowStep;
  onSubmit: (data: any) => void;
  isExecuting: boolean;
  previousData: Record<string, any>;
}

function StepInputForm({ step, onSubmit, isExecuting, previousData }: StepInputFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getFieldsForStepType = (stepType: string) => {
    switch (stepType) {
      case 'data-input':
        return [
          { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
          { name: 'email', label: 'Email Address', type: 'email', required: true },
          { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
          { name: 'requirements', label: 'Requirements', type: 'textarea', required: false }
        ];
      case 'ai':
        return [
          { name: 'documentType', label: 'Document Type', type: 'select', options: ['Contract', 'Invoice', 'Report'], required: true },
          { name: 'analysisType', label: 'Analysis Type', type: 'select', options: ['Extract Data', 'Classify', 'Summarize'], required: true }
        ];
      case 'api':
        return [
          { name: 'crmSystem', label: 'CRM System', type: 'select', options: ['Salesforce', 'HubSpot', 'Pipedrive'], required: true },
          { name: 'recordType', label: 'Record Type', type: 'select', options: ['Lead', 'Contact', 'Opportunity'], required: true }
        ];
      case 'document':
        return [
          { name: 'template', label: 'Template', type: 'select', options: ['Contract Template', 'Invoice Template', 'Report Template'], required: true },
          { name: 'format', label: 'Output Format', type: 'select', options: ['PDF', 'Word', 'HTML'], required: true }
        ];
      case 'notification':
        return [
          { name: 'recipient', label: 'Recipient', type: 'text', required: true },
          { name: 'channel', label: 'Channel', type: 'select', options: ['Email', 'SMS', 'Slack'], required: true },
          { name: 'message', label: 'Message', type: 'textarea', required: true }
        ];
      case 'decision':
        return [
          { name: 'criteria', label: 'Decision Criteria', type: 'textarea', required: true },
          { name: 'threshold', label: 'Approval Threshold', type: 'number', required: true }
        ];
      default:
        return [];
    }
  };

  const fields = getFieldsForStepType(step.type);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              value={formData[field.name] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              required={field.required}
              rows={3}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          ) : field.type === 'select' ? (
            <select
              value={formData[field.name] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              required={field.required}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              required={field.required}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          )}
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isExecuting}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          {isExecuting ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Execute Step</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}