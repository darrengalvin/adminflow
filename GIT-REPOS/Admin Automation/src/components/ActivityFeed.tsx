import React from 'react';
import { Clock, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: 'success',
      title: 'Workflow Completed',
      message: 'Customer Onboarding Process finished successfully',
      timestamp: '2 minutes ago',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'warning',
      title: 'Performance Alert',
      message: 'Xero API response time exceeded threshold (890ms)',
      timestamp: '15 minutes ago',
      icon: AlertCircle
    },
    {
      id: 3,
      type: 'info',
      title: 'New Integration',
      message: 'Stripe payment gateway connected successfully',
      timestamp: '1 hour ago',
      icon: Info
    },
    {
      id: 4,
      type: 'error',
      title: 'Workflow Failed',
      message: 'AI document processing failed - rate limit exceeded',
      timestamp: '2 hours ago',
      icon: XCircle
    },
    {
      id: 5,
      type: 'info',
      title: 'System Update',
      message: 'Workflow engine updated to version 2.1.4',
      timestamp: '4 hours ago',
      icon: Info
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-400';
      case 'warning':
        return 'text-amber-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
              <div className={`${getTypeColor(activity.type)} mt-1`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{activity.title}</p>
                <p className="text-slate-400 text-sm mt-1">{activity.message}</p>
                <div className="flex items-center space-x-1 mt-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}