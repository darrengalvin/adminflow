import React, { useState, useEffect } from 'react';
import { 
  History, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Tag,
  AlertTriangle,
  Loader,
  Filter,
  Search
} from 'lucide-react';
import { WorkflowRun, WorkflowActivity } from '../types/workflow';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { useAuth } from '../contexts/AuthContext';
import { USE_FIREBASE } from '../config/appConfig';

interface WorkflowHistoryManagerProps {
  currentRun?: WorkflowRun;
  onSelectRun?: (run: WorkflowRun) => void;
  onNewRun?: () => void;
}

const WorkflowHistoryManager: React.FC<WorkflowHistoryManagerProps> = ({
  currentRun,
  onSelectRun,
  onNewRun
}) => {
  const localAuth = USE_FIREBASE ? null : useAuth();
  const firebaseAuth = USE_FIREBASE ? useFirebaseAuth() : null;
  
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(currentRun || null);
  const [expandedRuns, setExpandedRuns] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load workflow runs from storage
  useEffect(() => {
    loadWorkflowRuns();
  }, []);

  const loadWorkflowRuns = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would load from Firebase/localStorage
      // For now, we'll simulate with some demo data
      const demoRuns: WorkflowRun[] = [
        {
          id: 'run-001',
          name: 'TechCorp Solutions - Team Building Event',
          startTime: new Date(Date.now() - 3600000), // 1 hour ago
          endTime: new Date(Date.now() - 3300000), // 55 minutes ago
          status: 'completed',
          progress: 100,
          totalSteps: 6,
          completedSteps: 6,
          failedSteps: 0,
          createdBy: 'admin@yourcaio.co.uk',
          tags: ['team-building', 'london', 'completed'],
          activities: []
        },
        {
          id: 'run-002',
          name: 'InnovateCorp - Leadership Retreat',
          startTime: new Date(Date.now() - 7200000), // 2 hours ago
          endTime: new Date(Date.now() - 6900000), // 1h 55m ago
          status: 'failed',
          progress: 45,
          currentStep: 'GoHighLevel Opportunity',
          totalSteps: 6,
          completedSteps: 2,
          failedSteps: 1,
          error: 'GoHighLevel API Error: Invalid JWT token',
          createdBy: 'admin@yourcaio.co.uk',
          tags: ['leadership', 'retreat', 'failed'],
          activities: []
        },
        {
          id: 'run-003',
          name: 'StartupHub - Networking Event',
          startTime: new Date(),
          status: 'running',
          progress: 33,
          currentStep: 'GoHighLevel Opportunity',
          totalSteps: 6,
          completedSteps: 1,
          failedSteps: 0,
          createdBy: 'admin@yourcaio.co.uk',
          tags: ['networking', 'startup', 'running'],
          activities: []
        }
      ];
      
      setRuns(demoRuns);
    } catch (error) {
      console.error('Failed to load workflow runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkflowRun = async (run: WorkflowRun) => {
    // In a real implementation, this would save to Firebase/localStorage
    console.log('Saving workflow run:', run);
  };

  const toggleRunExpansion = (runId: string) => {
    const newExpanded = new Set(expandedRuns);
    if (newExpanded.has(runId)) {
      newExpanded.delete(runId);
    } else {
      newExpanded.add(runId);
    }
    setExpandedRuns(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled': return <Square className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = Math.floor((end.getTime() - startTime.getTime()) / 1000);
    
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
  };

  const filteredRuns = runs.filter(run => {
    const matchesSearch = run.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         run.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading workflow history...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">Workflow History</h3>
            <span className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded-full">
              {runs.length} runs
            </span>
          </div>
          <button
            onClick={onNewRun}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>New Run</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search runs by name or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Runs List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredRuns.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No workflow runs found</p>
            {searchTerm && (
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredRuns.map((run) => (
              <div key={run.id} className="hover:bg-slate-50 transition-colors">
                <div 
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => {
                    setSelectedRun(run);
                    onSelectRun?.(run);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRunExpansion(run.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedRuns.has(run.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {getStatusIcon(run.status)}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">{run.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{run.startTime.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(run.startTime, run.endTime)}</span>
                          </span>
                          <span>{run.completedSteps}/{run.totalSteps} steps</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Progress Bar */}
                      <div className="w-24">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              run.status === 'completed' ? 'bg-green-500' :
                              run.status === 'failed' ? 'bg-red-500' :
                              run.status === 'running' ? 'bg-blue-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${run.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{run.progress}%</span>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(run.status)}`}>
                        {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {run.tags && run.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {run.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Error Message */}
                  {run.error && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{run.error}</span>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedRuns.has(run.id) && (
                  <div className="px-6 pb-4 border-t border-slate-100 bg-slate-25">
                    <div className="pt-4">
                      <h5 className="font-medium text-slate-900 mb-2">Run Details</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Created by:</span>
                          <span className="ml-2 text-slate-900">{run.createdBy}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Current Step:</span>
                          <span className="ml-2 text-slate-900">{run.currentStep || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Failed Steps:</span>
                          <span className="ml-2 text-slate-900">{run.failedSteps}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Run ID:</span>
                          <span className="ml-2 text-slate-900 font-mono text-xs">{run.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowHistoryManager; 