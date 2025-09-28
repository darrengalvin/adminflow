import React, { useState, useEffect } from 'react';
import { Plus, Zap, BarChart3, Clock, ArrowRight, Search, Filter, CheckCircle, Circle, Play, Settings, RefreshCw } from 'lucide-react';
import { Workflow, Task } from '../types';
import { WorkflowBuilder } from './WorkflowBuilder';
import { WorkflowDetails } from './WorkflowDetails';
import { taskStorage, AnalyzedTask } from '../utils/taskStorage';

interface WorkflowDesignerProps {
  workflows?: Workflow[];
  onNavigateToAnalysis: () => void;
  onWorkflowSave?: (workflow: Workflow) => void;
  onWorkflowExecute?: (workflowId: string) => void;
}

export function WorkflowDesigner({ workflows: propWorkflows, onNavigateToAnalysis, onWorkflowSave, onWorkflowExecute }: WorkflowDesignerProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>(propWorkflows || []);
  const [analyzedTasks, setAnalyzedTasks] = useState<AnalyzedTask[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showTaskSelection, setShowTaskSelection] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  // Update local state when prop changes
  useEffect(() => {
    if (propWorkflows) {
      console.log('📦 Received workflows from parent:', propWorkflows.length);
      setWorkflows(propWorkflows);
    }
  }, [propWorkflows]);

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

  useEffect(() => {
    // Only load from storage if no workflows prop provided
    if (!propWorkflows) {
      loadWorkflowsFromStorage();
    }
    loadAnalyzedTasksFromStorage();
  }, [propWorkflows]);

  // Add listener to reload workflows when window gains focus or becomes visible
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Window focused, reloading workflows...');
      if (!propWorkflows) {
        loadWorkflowsFromStorage();
      }
      loadAnalyzedTasksFromStorage();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page became visible, reloading workflows...');
        if (!propWorkflows) {
          loadWorkflowsFromStorage();
        }
        loadAnalyzedTasksFromStorage();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [propWorkflows]);

  const loadWorkflowsFromStorage = () => {
    try {
      const savedWorkflows = localStorage.getItem('automationWorkflows');
      console.log('📦 Loading workflows from localStorage:', savedWorkflows ? 'Found data' : 'No data');
      if (savedWorkflows) {
        const workflowsData = JSON.parse(savedWorkflows);
        const workflowsList = Object.values(workflowsData) as Workflow[];
        console.log('✅ Loaded workflows:', workflowsList.length, 'workflows found');
        console.log('📋 Workflow names:', workflowsList.map(w => w.name));
        setWorkflows(workflowsList);
      } else {
        console.log('❌ No workflows found in localStorage');
        setWorkflows([]);
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
        waitTime: '0 seconds',
        // Include the full AI analysis for use in WorkflowDetails
        aiAnalysis: task.aiSuggestion
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

  const filteredWorkflows = (workflows || []).filter(workflow => {
    const matchesSearch = workflow.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
    const workflow = (workflows || []).find(w => w.id === selectedWorkflow);
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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Workflow Designer</h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              Design automation workflows from your analyzed tasks
            </p>
          </div>
          {/* Only show header buttons when there are workflows */}
          {(workflows || []).length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button 
                onClick={() => {
                  console.log('🔄 Manual refresh clicked');
                  console.log('🔍 Debug - All localStorage keys:', Object.keys(localStorage));
                  console.log('🔍 Debug - automationWorkflows key:', localStorage.getItem('automationWorkflows'));
                  console.log('🔍 Debug - All localStorage data:');
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    console.log(`  ${key}:`, localStorage.getItem(key));
                  }
                  loadWorkflowsFromStorage();
                  loadAnalyzedTasksFromStorage();
                }}
                className="px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-medium"
                style={{ 
                  background: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
                title="Refresh workflows from storage"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setShowTaskSelection(true)}
                className="px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-medium"
                style={{ 
                  background: 'var(--color-accent-primary)', 
                  color: 'white',
                  border: '1px solid var(--color-accent-primary)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Zap className="h-4 w-4" />
                <span>From Tasks</span>
              </button>
              <button 
                onClick={() => setShowBuilder(true)}
                className="px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-medium"
                style={{ 
                  background: 'var(--color-accent-secondary)', 
                  color: 'white',
                  border: '1px solid var(--color-accent-secondary)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Plus className="h-4 w-4" />
                <span>Manual Create</span>
              </button>
            </div>
          )}
        </div>

        {/* Available Tasks Summary - Only show if there are tasks */}
        {availableTasks.length > 0 && (
          <div className="card p-6 mb-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Ready for Workflow Creation</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {availableTasks.length} analyzed task{availableTasks.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <button 
                onClick={() => setShowTaskSelection(true)}
                className="px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-medium"
                style={{ 
                  background: 'var(--color-accent-primary)', 
                  color: 'white',
                  border: '1px solid var(--color-accent-primary)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Zap className="h-4 w-4" />
                <span>Create Workflow</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTasks.slice(0, 6).map(task => (
                <div key={task.id} className="card p-4" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}>
                  <h4 className="font-medium text-sm truncate mb-2" style={{ color: 'var(--text-primary)' }}>{task.name}</h4>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <Clock className="h-3 w-3" />
                    <span>{task.timeSpent}</span>
                  </div>
                </div>
              ))}
              {availableTasks.length > 6 && (
                <div className="card p-4 flex items-center justify-center" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', opacity: '0.7' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    +{availableTasks.length - 6} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        {workflows.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-200"
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-lg transition-all duration-200"
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
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
        {(workflows || []).length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="card p-6 cursor-pointer transition-all duration-200 group hover:shadow-lg"
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-primary)'
                }}
                onClick={() => setSelectedWorkflow(workflow.id)}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {workflow.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onWorkflowExecute?.(workflow.id);
                      }}
                      className="p-2 rounded-lg transition-all duration-200"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--status-success)';
                        e.currentTarget.style.background = 'var(--status-success-bg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add edit functionality
                      }}
                      className="p-2 rounded-lg transition-all duration-200"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-accent-primary)';
                        e.currentTarget.style.background = 'var(--color-accent-primary-bg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {workflow.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--text-tertiary)' }}>Steps:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{workflow.steps?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--text-tertiary)' }}>Progress:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{workflow.progress || 0}%</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: 'var(--bg-tertiary)' }}>
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${workflow.progress || 0}%`,
                        background: `linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary))`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Created {formatDate(workflow.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    {(workflow.tags || []).slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {tag}
                      </span>
                    ))}
                    {(workflow.tags || []).length > 2 && (
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        +{(workflow.tags || []).length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Clean Empty State - CSS Grid Centered */
          <div 
            style={{ 
              display: 'grid',
              placeItems: 'center',
              minHeight: '70vh',
              width: '100%',
              gridTemplateColumns: '1fr',
              gridTemplateRows: '1fr'
            }}
          >
            <div 
              style={{
                textAlign: 'center',
                maxWidth: '32rem',
                width: '100%',
                padding: '0 2rem'
              }}
            >
              <div className="mb-12">
                <div className="flex justify-center mb-8" style={{ display: 'flex', justifyContent: 'center' }}>
                  <Zap className="h-24 w-24" style={{ color: 'var(--text-tertiary)', opacity: '0.3' }} />
                </div>
                <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)', textAlign: 'center' }}>No Workflows Yet</h3>
                <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Create your first automation workflow to get started with streamlining your business processes
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Start by analyzing your tasks, then save them to workflows for automation.
                </p>
              </div>
              
              <div className="flex justify-center" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button 
                  onClick={onNavigateToAnalysis}
                  className="px-10 py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 font-semibold text-lg"
                  style={{ 
                    background: 'var(--color-accent-primary)', 
                    color: 'white',
                    border: '1px solid var(--color-accent-primary)',
                    minWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Analyze Tasks</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}