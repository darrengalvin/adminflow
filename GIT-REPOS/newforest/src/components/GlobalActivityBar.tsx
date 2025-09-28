import React, { useState } from 'react';
import { 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pause, 
  X, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Loader,
  Mail,
  Target,
  FileText,
  CreditCard,
  Database,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';
import { GlobalActivity } from '../types/activity';

const GlobalActivityBar: React.FC = () => {
  const { activities, stats, pauseActivity, resumeActivity, removeActivity, clearCompleted } = useActivity();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Don't show if no activities
  if (activities.length === 0 || !isVisible) {
    return null;
  }

  const activeActivities = activities.filter(a => a.status === 'running' || a.status === 'queued' || a.status === 'paused');
  const recentCompleted = activities.filter(a => a.status === 'completed').slice(0, 3);

  const getActivityIcon = (type: string, status: string) => {
    const iconProps = { className: "w-4 h-4" };
    
    if (status === 'running') {
      return <Loader {...iconProps} className="w-4 h-4 animate-spin" />;
    }
    
    switch (type) {
      case 'workflow': return <Zap {...iconProps} />;
      case 'api_call': return <Target {...iconProps} />;
      case 'email_processing': return <Mail {...iconProps} />;
      case 'document_generation': return <FileText {...iconProps} />;
      case 'payment_check': return <CreditCard {...iconProps} />;
      case 'data_sync': return <Database {...iconProps} />;
      default: return <Activity {...iconProps} />;
    }
  };

  const getStatusColor = (status: string, priority: string) => {
    switch (status) {
      case 'running': 
        return priority === 'urgent' ? 'text-red-600' : 
               priority === 'high' ? 'text-orange-600' : 'text-blue-600';
      case 'queued': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'paused': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-3 h-3" />;
      case 'queued': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'failed': return <AlertTriangle className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const formatTimeElapsed = (startTime: Date) => {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    if (elapsed < 60) return `${elapsed}s`;
    if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m`;
    return `${Math.floor(elapsed / 3600)}h`;
  };

  const ActivityItem: React.FC<{ activity: GlobalActivity; isCompact?: boolean }> = ({ activity, isCompact = false }) => (
    <div className={`flex items-center space-x-3 ${isCompact ? 'py-2' : 'py-3'} px-4 border-l-2 ${
      activity.priority === 'urgent' ? 'border-red-500' :
      activity.priority === 'high' ? 'border-orange-500' :
      'border-blue-500'
    } hover:bg-slate-50 transition-colors`}>
      <div className={`flex items-center space-x-2 ${getStatusColor(activity.status, activity.priority)}`}>
        {getActivityIcon(activity.type, activity.status)}
        {getStatusIcon(activity.status)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className={`font-medium text-slate-900 truncate ${isCompact ? 'text-sm' : ''}`}>
            {activity.name}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${
            activity.priority === 'urgent' ? 'bg-red-100 text-red-700' :
            activity.priority === 'high' ? 'bg-orange-100 text-orange-700' :
            activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {activity.priority}
          </span>
        </div>
        
        <div className={`text-slate-600 truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
          <span className="font-medium">{activity.stage}</span>
          {activity.details && (
            <span className="ml-2">• {activity.details}</span>
          )}
        </div>
        
        {activity.currentStep && activity.totalSteps && (
          <div className={`text-slate-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            Step {activity.currentStep} of {activity.totalSteps}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                activity.status === 'completed' ? 'bg-green-500' :
                activity.status === 'failed' ? 'bg-red-500' :
                activity.status === 'paused' ? 'bg-gray-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${activity.progress}%` }}
            />
          </div>
          <span className={`font-mono font-medium min-w-[3rem] text-right ${isCompact ? 'text-xs' : 'text-sm'} ${
            getStatusColor(activity.status, activity.priority)
          }`}>
            {activity.progress.toFixed(0)}%
          </span>
        </div>
        
        {/* Time */}
        <div className={`text-slate-500 min-w-[2rem] text-right ${isCompact ? 'text-xs' : 'text-sm'}`}>
          {formatTimeElapsed(activity.startTime)}
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-1">
          {activity.status === 'running' && (
            <button
              onClick={() => pauseActivity(activity.id)}
              className="p-1 text-slate-400 hover:text-orange-600 transition-colors"
              title="Pause"
            >
              <Pause className="w-3 h-3" />
            </button>
          )}
          
          {activity.status === 'paused' && (
            <button
              onClick={() => resumeActivity(activity.id)}
              className="p-1 text-slate-400 hover:text-green-600 transition-colors"
              title="Resume"
            >
              <Play className="w-3 h-3" />
            </button>
          )}
          
          {(activity.status === 'completed' || activity.status === 'failed') && (
            <button
              onClick={() => removeActivity(activity.id)}
              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
              title="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Compact Bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-gradient-to-r from-blue-50 to-slate-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-900">System Activity</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            {stats.running > 0 && (
              <div className="flex items-center space-x-1 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{stats.running} Running</span>
              </div>
            )}
            
            {stats.queued > 0 && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <Clock className="w-3 h-3" />
                <span className="font-medium">{stats.queued} Queued</span>
              </div>
            )}
            
            {stats.completed > 0 && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span className="font-medium">{stats.completed} Completed</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs px-2 py-1 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Clear Completed
            </button>
          )}
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            title="Hide Activity Bar"
          >
            <EyeOff className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-600 hover:text-slate-900 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Expanded View */}
      {isExpanded && (
        <div className="max-h-80 overflow-y-auto bg-white">
          {activeActivities.length > 0 && (
            <div>
              <div className="px-6 py-2 bg-slate-50 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">Active Processes</h3>
              </div>
              {activeActivities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
          
          {recentCompleted.length > 0 && (
            <div>
              <div className="px-6 py-2 bg-slate-50 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">Recently Completed</h3>
              </div>
              {recentCompleted.map(activity => (
                <ActivityItem key={activity.id} activity={activity} isCompact />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Show/Hide Toggle Button (for when hidden)
export const ActivityBarToggle: React.FC = () => {
  const { activities } = useActivity();
  const [isVisible, setIsVisible] = useState(false);

  if (activities.length === 0) return null;

  return (
    <button
      onClick={() => setIsVisible(true)}
      className="fixed top-4 right-4 z-40 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      title="Show Activity Bar"
    >
      <Eye className="w-4 h-4" />
    </button>
  );
};

export default GlobalActivityBar; 