import React from 'react';
import { Loader, Zap, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { useActivity } from '../contexts/ActivityContext';

const GlobalActivityBanner: React.FC = () => {
  const { activities, stats } = useActivity();
  
  // Get running and queued activities
  const activeActivities = activities.filter(a => a.status === 'running' || a.status === 'queued');
  
  // Don't show banner if no active activities
  if (activeActivities.length === 0) return null;

  // Get the most important activity to highlight
  const primaryActivity = activeActivities.find(a => a.status === 'running') || activeActivities[0];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Primary Activity Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="font-medium">
                {stats.running > 0 ? `${stats.running} Running` : `${stats.queued} Queued`}
              </span>
            </div>
            
            {primaryActivity && (
              <div className="hidden sm:flex items-center space-x-2 text-sm opacity-90">
                <span>•</span>
                <span className="truncate max-w-xs">{primaryActivity.name}</span>
                {primaryActivity.stage && (
                  <>
                    <span>•</span>
                    <span>{primaryActivity.stage}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Activity Summary & Progress */}
          <div className="flex items-center space-x-4">
            {/* Multiple Activities Indicator */}
            {activeActivities.length > 1 && (
              <div className="hidden md:flex items-center space-x-2 text-sm opacity-90">
                <span>+{activeActivities.length - 1} more</span>
              </div>
            )}
            
            {/* Primary Activity Progress */}
            {primaryActivity && primaryActivity.status === 'running' && (
              <div className="flex items-center space-x-2">
                <div className="text-sm opacity-90">
                  {Math.round(primaryActivity.progress)}%
                </div>
                <div className="w-16 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${primaryActivity.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Activity Stats */}
            <div className="flex items-center space-x-3 text-sm">
              {stats.running > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>{stats.running}</span>
                </div>
              )}
              {stats.queued > 0 && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{stats.queued}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Multiple Activities Compact List (Mobile) */}
        {activeActivities.length > 1 && (
          <div className="sm:hidden pb-2">
            <div className="text-xs opacity-75">
              {activeActivities.slice(1, 3).map((activity, index) => (
                <div key={activity.id} className="truncate">
                  • {activity.name}
                </div>
              ))}
              {activeActivities.length > 3 && (
                <div>• +{activeActivities.length - 3} more workflows</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalActivityBanner; 