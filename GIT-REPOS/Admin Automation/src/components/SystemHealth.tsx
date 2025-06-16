import React from 'react';
import { Server, Database, Zap, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export function SystemHealth() {
  const healthItems = [
    {
      name: 'API Gateway',
      status: 'healthy',
      value: '99.9%',
      icon: Server,
      color: '#10B981'
    },
    {
      name: 'Database',
      status: 'healthy',
      value: '2.1ms',
      icon: Database,
      color: '#3B82F6'
    },
    {
      name: 'Workflow Engine',
      status: 'warning',
      value: '87%',
      icon: Zap,
      color: '#F59E0B'
    },
    {
      name: 'Security',
      status: 'healthy',
      value: 'Secure',
      icon: Shield,
      color: '#10B981'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">System Health</h3>
      
      <div className="space-y-4">
        {healthItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <div key={item.name} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}30` }}
                >
                  <IconComponent className="h-4 w-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{item.name}</p>
                  <p className="text-slate-400 text-xs">{item.value}</p>
                </div>
              </div>
              {getStatusIcon(item.status)}
            </div>
          );
        })}
      </div>

      {/* System Metrics */}
      <div className="mt-6 pt-6 border-t border-slate-600/50">
        <h4 className="text-white font-medium mb-4">Performance Metrics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">45ms</p>
            <p className="text-slate-400 text-xs">Avg Response</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">99.8%</p>
            <p className="text-slate-400 text-xs">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">12K</p>
            <p className="text-slate-400 text-xs">Daily Requests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">847</p>
            <p className="text-slate-400 text-xs">Active Workflows</p>
          </div>
        </div>
      </div>
    </div>
  );
}