import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Database,
  Zap,
  Clock
} from 'lucide-react';
import { WorkflowStep } from '../types';

interface WorkflowStepProps {
  step: WorkflowStep;
  isActive: boolean;
  isCompleted: boolean;
  showTip: boolean;
  onToggleTip: () => void;
}

export function WorkflowStepComponent({ 
  step, 
  isActive,
  isCompleted,
  showTip, 
  onToggleTip 
}: WorkflowStepProps) {
  const renderStepOutput = () => {
    if (!isCompleted || !step.data) return null;

    return (
      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2 mb-3">
          <Database className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            System Output:
          </span>
        </div>
        
        {/* Render specific outputs based on step type */}
        {step.id === 'email-trigger' && step.data?.detectedEmail && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Trigger Activated:</strong> Email from {step.data.detectedEmail.from}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Subject:</strong> "{step.data.detectedEmail.subject}"
            </div>
            <div className="text-sm text-gray-700">
              <strong>Confidence:</strong> {step.data.detectedEmail.confidence}
            </div>
          </div>
        )}

        {step.id === 'ai-extraction' && step.data?.extractedData && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Company:</strong> {step.data.extractedData.company}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Contact:</strong> {step.data.extractedData.contact}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Group Size:</strong> {step.data.extractedData.groupSize}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Budget:</strong> {step.data.extractedData.budget}
            </div>
            <div className="text-sm text-gray-700">
              <strong>AI Confidence:</strong> {step.data.confidence}
            </div>
          </div>
        )}

        {step.id === 'crm-contact-create' && step.data?.crmResponse && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Contact ID:</strong> {step.data.crmResponse.contactId}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Lead Score:</strong> {step.data.crmResponse.leadScore}/100
            </div>
            <div className="text-sm text-gray-700">
              <strong>Assigned To:</strong> {step.data.crmResponse.assignedTo}
            </div>
          </div>
        )}

        {step.id === 'auto-acknowledgment' && step.data?.emailSent && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Email Sent:</strong> {step.data.emailSent.sentAt}
            </div>
            <div className="text-sm text-gray-700">
              <strong>To:</strong> {step.data.emailSent.to}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Template:</strong> {step.data.emailSent.template}
            </div>
          </div>
        )}

        {step.id === 'crm-deal-creation' && step.data?.dealCreated && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Deal ID:</strong> {step.data.dealCreated.dealId}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Value:</strong> {step.data.dealCreated.value}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Probability:</strong> {step.data.dealCreated.probability}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Close Date:</strong> {step.data.dealCreated.closeDate}
            </div>
          </div>
        )}

        {step.id === 'ai-programme-design' && step.data?.programmeOptions && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Recommended:</strong> {step.data.recommendedOption}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Price:</strong> {step.data.programmeOptions[0]?.price}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Suitability:</strong> {step.data.programmeOptions[0]?.suitability}
            </div>
          </div>
        )}

        {step.id === 'pandadoc-generation' && step.data?.proposalGenerated && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Document ID:</strong> {step.data.proposalGenerated.documentId}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Total Value:</strong> {step.data.proposalGenerated.totalValue}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Pages:</strong> {step.data.proposalGenerated.pages}
            </div>
          </div>
        )}

        {step.id === 'proposal-delivery' && step.data?.proposalSent && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Sent At:</strong> {step.data.proposalSent.sentAt}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Tracking:</strong> Enabled
            </div>
            <div className="text-sm text-gray-700">
              <strong>Follow-up:</strong> {step.data.proposalSent.followUpScheduled}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getStepIcon = () => {
    if (isCompleted) {
      return <CheckCircle2 className="h-5 w-5 text-white" />;
    } else if (isActive) {
      return <div className="animate-pulse"><Circle className="h-5 w-5 text-white" /></div>;
    } else if (step.id === 'email-trigger') {
      return <Zap className="h-5 w-5 text-gray-500" />;
    } else {
      return <span className="text-sm font-bold text-gray-500">•</span>;
    }
  };

  const getStepStatus = () => {
    if (isCompleted) return 'Completed';
    if (isActive) return 'In Progress';
    if (step.id === 'email-trigger') return 'Waiting for Trigger';
    return 'Waiting';
  };

  const getStepStatusColor = () => {
    if (isCompleted) return 'bg-green-100 text-green-800 border-green-200';
    if (isActive) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (step.id === 'email-trigger') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  return (
    <div className={`bg-white rounded-lg border transition-all duration-300 ${
      isActive ? 'border-blue-200 shadow-md' : 'border-gray-100'
    }`}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Step Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isCompleted ? 'bg-green-500' :
            isActive ? 'bg-blue-500' :
            'bg-gray-300'
          }`}>
            {getStepIcon()}
          </div>

          {/* Step Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-800">{step.name}</h4>
              {step.tips && (
                <button
                  onClick={onToggleTip}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Tips</span>
                  {showTip ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>

            <p className="text-gray-600 mb-3">{step.description}</p>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStepStatusColor()}`}>
                {getStepStatus()}
              </span>
              {isActive && step.duration && !isNaN(step.duration) && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>~{Math.round(step.duration / 1000)}s</span>
                </div>
              )}
            </div>

            {/* System Output */}
            {renderStepOutput()}

            {/* Tips Section */}
            {showTip && step.tips && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">How this works:</span>
                </div>
                <ul className="space-y-1">
                  {step.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-gray-700 flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 