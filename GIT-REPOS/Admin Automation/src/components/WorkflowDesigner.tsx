import React, { useState, useEffect } from 'react';
import { Plus, Zap, BarChart3, Clock, ArrowRight, Search, Filter, CheckCircle, Circle, Play, Settings } from 'lucide-react';
import { Workflow, Task } from '../types';
import { WorkflowBuilder } from './WorkflowBuilder';
import { WorkflowDetails } from './WorkflowDetails';
import { taskStorage, AnalyzedTask } from '../utils/taskStorage';

interface WorkflowDesignerProps {
  onNavigateToAnalysis: () => void;
  onWorkflowSave?: (workflow: Workflow) => void;
  onWorkflowExecute?: (workflowId: string) => void;
}

export function WorkflowDesigner({ onNavigateToAnalysis, onWorkflowSave, onWorkflowExecute }: WorkflowDesignerProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [analyzedTasks, setAnalyzedTasks] = useState<AnalyzedTask[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showTaskSelection, setShowTaskSelection] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  useEffect(() => {
    loadWorkflowsFromStorage();
    loadAnalyzedTasksFromStorage();
  }, []);

  const loadWorkflowsFromStorage = () => {
    try {
      const savedWorkflows = localStorage.getItem('automationWorkflows');
      if (savedWorkflows) {
        const workflowsData = JSON.parse(savedWorkflows);
        const workflowsList = Object.values(workflowsData) as Workflow[];
        setWorkflows(workflowsList);
      }
    } catch (error) {
      console.error('Error loading workflows from storage:', error);
    }
  };

  const loadAnalyzedTasksFromStorage = () => {
    try {
      const tasks = taskStorage.getAllTasks();
      setAnalyzedTasks(tasks);
    } catch (error) {
      console.error('Error loading analyzed tasks from storage:', error);
    }
  };



  const createWorkflowFromTasks = () => {
    if (selectedTasks.length === 0 || !newWorkflowName.trim()) return;

    const tasksToAdd = analyzedTasks.filter(task => selectedTasks.includes(task.id));
    
    const workflowSteps = tasksToAdd.map((task, index) => ({
      id: `step_${Date.now()}_${index}`,
      name: task.name,
      title: task.name,
      description: task.description,
      type: 'api' as const,
      status: 'pending' as const,
      config: {
        software: task.software,
        automationType: task.aiSuggestion?.automation?.type || 'API Integration',
        apiConnections: task.aiSuggestion?.automation?.apiConnections || [],
        implementationSteps: task.aiSuggestion?.implementation?.steps || [],
        difficulty: task.aiSuggestion?.implementation?.difficulty || 'Medium',
        setupTime: task.aiSuggestion?.implementation?.setupTime || '30 minutes',
        icon: '🤖',
        trigger: 'Manual trigger',
        condition: 'Always run this step',
        waitTime: '0 seconds'
      }
    }));

    const totalAnnualSavings = tasksToAdd.reduce((sum, task) => {
      const value = parseInt(task.aiSuggestion?.impact?.valuePerYear?.replace(/[^0-9]/g, '') || '0');
      return sum + value;
    }, 0);

    const newWorkflow: Workflow = {
      id: `workflow_${Date.now()}`,
      name: newWorkflowName,
      description: `Automated workflow containing ${tasksToAdd.length} tasks: ${tasksToAdd.map(t => t.name).join(', ')}`,
      status: 'draft',
      priority: 'medium',
      steps: workflowSteps,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDuration: workflowSteps.length * 30, // 30 minutes per step
      triggers: ['manual'],
      tags: ['automation', 'task-analysis']
    };

    // Save to localStorage
    try {
      const savedWorkflows = localStorage.getItem('automationWorkflows');
      const workflowsData = savedWorkflows ? JSON.parse(savedWorkflows) : {};
      workflowsData[newWorkflow.id] = newWorkflow;
      localStorage.setItem('automationWorkflows', JSON.stringify(workflowsData));
      
      // Update analyzed tasks to mark them as added to workflow
      selectedTasks.forEach(taskId => {
        taskStorage.updateTask(taskId, { 
          addedToWorkflow: true, 
          workflowName: newWorkflowName 
        });
      });
      
      // Reload tasks to reflect changes
      loadAnalyzedTasksFromStorage();

      // Update workflows list
      setWorkflows([...workflows, newWorkflow]);
      
      // Call parent callback if provided
      onWorkflowSave?.(newWorkflow);

      // Reset form
      setSelectedTasks([]);
      setNewWorkflowName('');
      setShowTaskSelection(false);
      
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || workflow.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const availableTasks = analyzedTasks.filter(task => !task.addedToWorkflow);

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

  // Show workflow details
  if (selectedWorkflow) {
    const workflow = workflows.find(w => w.id === selectedWorkflow);
    if (workflow) {
      return (
        <WorkflowDetails
          workflow={workflow}
          onBack={() => setSelectedWorkflow(null)}
          onExecute={() => onWorkflowExecute?.(workflow.id)}
        />
      );
    }
  }

  // Show workflow builder
  if (showBuilder) {
    return (
      <WorkflowBuilder
        onSave={(workflow) => {
          onWorkflowSave?.(workflow);
          setShowBuilder(false);
        }}
        onExecute={(workflow) => {
          onWorkflowExecute?.(workflow.id);
          setShowBuilder(false);
        }}
      />
    );
  }

  // Show task selection modal
  if (showTaskSelection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Create Workflow from Tasks</h1>
            <p className="text-slate-400 mt-1">
              Select analyzed tasks to include in your new workflow
            </p>
          </div>
          <button 
            onClick={() => setShowTaskSelection(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6">
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Workflow Name</label>
            <input
              type="text"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              placeholder="Enter workflow name..."
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-medium">Available Tasks ({availableTasks.length})</h3>
            {availableTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">No analyzed tasks available.</p>
                <button 
                  onClick={onNavigateToAnalysis}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Analyze Tasks First
                </button>
              </div>
            ) : (
              <>
                {availableTasks.map(task => (
                  <div 
                    key={task.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTasks.includes(task.id)
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-700/70'
                    }`}
                    onClick={() => {
                      setSelectedTasks(prev => 
                        prev.includes(task.id)
                          ? prev.filter(id => id !== task.id)
                          : [...prev, task.id]
                      )
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {selectedTasks.includes(task.id) ? (
                        <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{task.name}</h4>
                        <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                          <span>Software: {task.software}</span>
                          <span>Time: {task.timeSpent}</span>
                          {task.aiSuggestion?.impact?.valuePerYear && (
                            <span>Savings: {task.aiSuggestion.impact.valuePerYear}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedTasks.length > 0 && (
                  <div className="flex justify-between items-center pt-4 border-t border-slate-600/50">
                    <div className="text-slate-400">
                      {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                    </div>
                    <button 
                      onClick={createWorkflowFromTasks}
                      disabled={!newWorkflowName.trim()}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Create Workflow
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Workflow Designer</h1>
          <p className="text-slate-400 mt-1">
            Design automation workflows from your analyzed tasks
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowTaskSelection(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>From Tasks</span>
          </button>
          <button 
            onClick={() => setShowBuilder(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Manual Create</span>
          </button>
        </div>
      </div>

      {/* Task Analysis Guidance */}
      {analyzedTasks.length === 0 && (
        <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Start with Task Analysis</h3>
          </div>
          <p className="text-slate-300 mb-4">
            To create effective workflows, start by analyzing your repetitive tasks. 
            Our AI will identify the best automation opportunities and help you build workflows.
          </p>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onNavigateToAnalysis}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Analyze Tasks First</span>
            </button>
            <div className="text-slate-400 text-sm">
              It takes 2-3 minutes to analyze a task
            </div>
          </div>
        </div>
      )}

      {/* Available Tasks Summary */}
      {availableTasks.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Ready for Workflow Creation</h3>
              <p className="text-slate-400 text-sm">
                {availableTasks.length} analyzed task{availableTasks.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <button 
              onClick={() => setShowTaskSelection(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Zap className="h-4 w-4" />
              <span>Create Workflow</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableTasks.slice(0, 6).map(task => (
              <div key={task.id} className="bg-slate-700/50 rounded-lg p-3">
                <h4 className="text-white text-sm font-medium truncate">{task.name}</h4>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{task.description}</p>
                <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>{task.timeSpent}</span>
                </div>
              </div>
            ))}
            {availableTasks.length > 6 && (
              <div className="bg-slate-700/30 rounded-lg p-3 flex items-center justify-center">
                <span className="text-slate-400 text-sm">
                  +{availableTasks.length - 6} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {workflows.length > 0 && (
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
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      )}

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200 group cursor-pointer"
            onClick={() => setSelectedWorkflow(workflow.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {workflow.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
                  {workflow.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onWorkflowExecute?.(workflow.id);
                  }}
                  className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                >
                  <Play className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add edit functionality
                  }}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {workflow.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Steps:</span>
                <span className="text-slate-300">{workflow.steps.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Progress:</span>
                <span className="text-slate-300">{workflow.progress}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${workflow.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
              <div className="text-xs text-slate-500">
                Created {new Date(workflow.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-1">
                {workflow.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded">
                    {tag}
                  </span>
                ))}
                {workflow.tags.length > 2 && (
                  <span className="text-slate-500 text-xs">
                    +{workflow.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && analyzedTasks.length > 0 && (
        <div className="text-center py-12">
          <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Ready to Create Your First Workflow</h3>
          <p className="text-slate-400 mb-6">
            You have {availableTasks.length} analyzed task{availableTasks.length !== 1 ? 's' : ''} ready to be automated
          </p>
          <button 
            onClick={() => setShowTaskSelection(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Create Your First Workflow</span>
          </button>
        </div>
      )}

      {workflows.length === 0 && analyzedTasks.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No Workflows Yet</h3>
          <p className="text-slate-400 mb-6">
            Start by analyzing your tasks or create a workflow manually
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button 
              onClick={onNavigateToAnalysis}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analyze Tasks</span>
            </button>
            <button 
              onClick={() => setShowBuilder(true)}
              className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Manual Create</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}