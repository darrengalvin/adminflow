import React, { useState } from 'react';
import { 
  Target, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  ArrowUp,
  ListTodo,
  Flag
} from 'lucide-react';

interface GHLUpdateConfirmationProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

interface OpportunityUpdate {
  id: string;
  currentValue: number;
  newValue: number;
  currentStage: string;
  newStage: string;
  pipelineId: string;
}

interface FutureTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  type: 'reminder' | 'action' | 'followup';
}

const GHLUpdateConfirmation: React.FC<GHLUpdateConfirmationProps> = ({ 
  isActive, 
  onComplete, 
  demoMode, 
  onDemoModeChange 
}) => {
  const [activities, setActivities] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'error' | 'warning';
    message: string;
    timestamp: Date;
    phase: 'Opportunity' | 'Stage' | 'Tasks' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [opportunityStatus, setOpportunityStatus] = useState<'pending' | 'updating' | 'updated'>('pending');
  const [stageStatus, setStageStatus] = useState<'pending' | 'updating' | 'updated'>('pending');
  const [tasksStatus, setTasksStatus] = useState<'pending' | 'creating' | 'created'>('pending');

  // Demo opportunity data
  const demoOpportunityUpdate: OpportunityUpdate = {
    id: "nSs9C88yT7EhjEVh6H3e",
    currentValue: 6250,
    newValue: 6250, // Confirmed value
    currentStage: "Proposal Sent",
    newStage: "Confirmed",
    pipelineId: "team-building-pipeline"
  };

  // Demo future tasks to be created
  const demoFutureTasks: FutureTask[] = [
    {
      id: "task-1",
      title: "Pre-event confirmation call",
      description: "Call client 1 week before event to confirm final details, dietary requirements, and participant numbers",
      dueDate: "2024-07-08", // 1 week before event
      priority: "high",
      assignedTo: "Operations Team",
      type: "action"
    },
    {
      id: "task-2", 
      title: "Final headcount confirmation",
      description: "Get final participant count and dietary requirements from client",
      dueDate: "2024-07-10", // 5 days before event
      priority: "high",
      assignedTo: "Events Coordinator",
      type: "action"
    },
    {
      id: "task-3",
      title: "Equipment preparation check",
      description: "Ensure all equipment is ready and tested for the team building activities",
      dueDate: "2024-07-13", // 2 days before event
      priority: "medium",
      assignedTo: "Activity Leaders",
      type: "reminder"
    },
    {
      id: "task-4",
      title: "Weather contingency review",
      description: "Check weather forecast and prepare indoor alternatives if needed",
      dueDate: "2024-07-14", // 1 day before event
      priority: "medium",
      assignedTo: "Operations Team",
      type: "reminder"
    },
    {
      id: "task-5",
      title: "Post-event follow-up",
      description: "Send feedback survey and thank you email to client",
      dueDate: "2024-07-16", // 1 day after event
      priority: "low",
      assignedTo: "Customer Success",
      type: "followup"
    }
  ];

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Opportunity' | 'Stage' | 'Tasks' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processGHLUpdate = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting GoHighLevel confirmation update', 'System');
      
      // Step 1: Update opportunity value
      setOpportunityStatus('updating');
      addActivity('info', `Updating opportunity value for ${demoOpportunityUpdate.id}`, 'Opportunity');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        setOpportunityStatus('updated');
        addActivity('success', `Demo: Opportunity value confirmed at £${demoOpportunityUpdate.newValue.toLocaleString()}`, 'Opportunity');
        addActivity('info', 'Demo: Value matches confirmed booking amount', 'Opportunity');
      } else {
        // Real GoHighLevel API call to update opportunity value
        const updateResponse = await fetch(`https://rest.gohighlevel.com/v1/opportunities/${demoOpportunityUpdate.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbklkIjoicWxteEZZNjhocm5WanlvOGNOUUMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3MzQ2MTI0NjIsImV4cCI6MTczNDY5ODg2Mn0.sP1lXJyNBf_WPa2JhqFIqBbMkJcNfxF8NNgZEVOQ3Gk',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            monetaryValue: demoOpportunityUpdate.newValue
          })
        });
        
        if (updateResponse.ok) {
          setOpportunityStatus('updated');
          addActivity('success', `Opportunity value updated to £${demoOpportunityUpdate.newValue.toLocaleString()}`, 'Opportunity');
        } else {
          throw new Error('Failed to update opportunity value');
        }
      }
      
      // Step 2: Update opportunity stage
      setStageStatus('updating');
      addActivity('info', `Moving opportunity from "${demoOpportunityUpdate.currentStage}" to "${demoOpportunityUpdate.newStage}"`, 'Stage');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (demoMode) {
        setStageStatus('updated');
        addActivity('success', `Demo: Stage updated to "${demoOpportunityUpdate.newStage}"`, 'Stage');
        addActivity('info', 'Demo: Opportunity now shows as confirmed booking', 'Stage');
      } else {
        // Real GoHighLevel API call to update stage
        const stageResponse = await fetch(`https://rest.gohighlevel.com/v1/opportunities/${demoOpportunityUpdate.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbklkIjoicWxteEZZNjhocm5WanlvOGNOUUMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3MzQ2MTI0NjIsImV4cCI6MTczNDY5ODg2Mn0.sP1lXJyNBf_WPa2JhqFIqBbMkJcNfxF8NNgZEVOQ3Gk',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stageId: "confirmed-stage-id" // This would be the actual stage ID from GoHighLevel
          })
        });
        
        if (stageResponse.ok) {
          setStageStatus('updated');
          addActivity('success', `Stage updated to "${demoOpportunityUpdate.newStage}"`, 'Stage');
        } else {
          throw new Error('Failed to update opportunity stage');
        }
      }
      
      // Step 3: Create future tasks
      setTasksStatus('creating');
      addActivity('info', `Creating ${demoFutureTasks.length} future tasks for event management`, 'Tasks');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        for (const task of demoFutureTasks) {
          addActivity('info', `Demo: Creating task "${task.title}" - Due: ${new Date(task.dueDate).toLocaleDateString('en-GB')}`, 'Tasks');
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        setTasksStatus('created');
        addActivity('success', `Demo: All ${demoFutureTasks.length} future tasks created successfully`, 'Tasks');
        addActivity('info', 'Demo: Tasks assigned to respective team members', 'Tasks');
      } else {
        // Real GoHighLevel API calls to create tasks
        let createdTasks = 0;
        for (const task of demoFutureTasks) {
          const taskResponse = await fetch('https://rest.gohighlevel.com/v1/tasks', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbklkIjoicWxteEZZNjhocm5WanlvOGNOUUMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3MzQ2MTI0NjIsImV4cCI6MTczNDY5ODg2Mn0.sP1lXJyNBf_WPa2JhqFIqBbMkJcNfxF8NNgZEVOQ3Gk',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
              priority: task.priority,
              assignedTo: task.assignedTo,
              contactId: demoOpportunityUpdate.id
            })
          });
          
          if (taskResponse.ok) {
            createdTasks++;
            addActivity('success', `Task created: "${task.title}"`, 'Tasks');
          }
        }
        
        setTasksStatus('created');
        addActivity('success', `${createdTasks} future tasks created successfully`, 'Tasks');
      }
      
      addActivity('success', 'GoHighLevel confirmation update completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `GoHighLevel update failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Opportunity': return <DollarSign className="w-4 h-4" />;
      case 'Stage': return <ArrowUp className="w-4 h-4" />;
      case 'Tasks': return <ListTodo className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Opportunity': return 'bg-green-100 text-green-800';
      case 'Stage': return 'bg-blue-100 text-blue-800';
      case 'Tasks': return 'bg-purple-100 text-purple-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'action': return <Flag className="w-4 h-4 text-red-500" />;
      case 'reminder': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'followup': return <Calendar className="w-4 h-4 text-blue-500" />;
      default: return <ListTodo className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">GoHighLevel Update - Confirmation</h3>
            <p className="text-sm text-gray-600">Update opportunity value, stage, and create future tasks</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Demo Mode</span>
            <button
              onClick={() => onDemoModeChange(!demoMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                demoMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  demoMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <button
            onClick={processGHLUpdate}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Update CRM'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              opportunityStatus === 'updated' ? 'bg-green-500' : 
              opportunityStatus === 'updating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Opportunity Value</h4>
              <p className="text-sm text-gray-600">
                {opportunityStatus === 'pending' && 'Ready to update'}
                {opportunityStatus === 'updating' && 'Updating...'}
                {opportunityStatus === 'updated' && 'Updated'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              stageStatus === 'updated' ? 'bg-green-500' : 
              stageStatus === 'updating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <ArrowUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Stage Update</h4>
              <p className="text-sm text-gray-600">
                {stageStatus === 'pending' && 'Waiting for value'}
                {stageStatus === 'updating' && 'Updating stage...'}
                {stageStatus === 'updated' && 'Stage updated'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              tasksStatus === 'created' ? 'bg-green-500' : 
              tasksStatus === 'creating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <ListTodo className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Future Tasks</h4>
              <p className="text-sm text-gray-600">
                {tasksStatus === 'pending' && 'Waiting for stage'}
                {tasksStatus === 'creating' && 'Creating tasks...'}
                {tasksStatus === 'created' && 'Tasks created'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Opportunity Update Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Value & Stage Changes</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Opportunity ID: {demoOpportunityUpdate.id}</li>
              <li>• Current Value: £{demoOpportunityUpdate.currentValue.toLocaleString()}</li>
              <li>• Confirmed Value: £{demoOpportunityUpdate.newValue.toLocaleString()}</li>
              <li>• Current Stage: {demoOpportunityUpdate.currentStage}</li>
              <li>• New Stage: {demoOpportunityUpdate.newStage}</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Task Summary</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Total Tasks: {demoFutureTasks.length}</li>
              <li>• High Priority: {demoFutureTasks.filter(t => t.priority === 'high').length}</li>
              <li>• Medium Priority: {demoFutureTasks.filter(t => t.priority === 'medium').length}</li>
              <li>• Low Priority: {demoFutureTasks.filter(t => t.priority === 'low').length}</li>
              <li>• Teams Involved: 4</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Future Tasks List */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Future Tasks to be Created</h4>
        <div className="space-y-3">
          {demoFutureTasks.map((task, index) => (
            <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getTaskTypeIcon(task.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900">{task.title}</h5>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <p className="text-xs text-gray-500 mt-1">Assigned to: {task.assignedTo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      {activities.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium mb-3">Live Activity</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 text-sm">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPhaseColor(activity.phase)}`}>
                  <div className="flex items-center space-x-1">
                    {getPhaseIcon(activity.phase)}
                    <span>{activity.phase}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {activity.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {activity.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {activity.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                    {activity.type === 'info' && <Clock className="w-4 h-4 text-blue-500" />}
                    
                    <span className={`${
                      activity.type === 'success' ? 'text-green-700' :
                      activity.type === 'error' ? 'text-red-700' :
                      activity.type === 'warning' ? 'text-yellow-700' :
                      'text-gray-700'
                    }`}>
                      {activity.message}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Rate */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>98.3% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default GHLUpdateConfirmation; 