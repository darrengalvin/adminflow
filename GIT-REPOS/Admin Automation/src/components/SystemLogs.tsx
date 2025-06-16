import React, { useState } from 'react';
import { Search, Filter, Download, RefreshCw, Info, AlertTriangle, XCircle, Bug } from 'lucide-react';
import { LogEntry } from '../types';

interface SystemLogsProps {
  logs: LogEntry[];
}

export function SystemLogs({ logs }: SystemLogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const sources = Array.from(new Set(logs.map(log => log.source)));

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;
    return matchesSearch && matchesLevel && matchesSource;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'debug':
        return <Bug className="h-4 w-4 text-purple-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-600/20 text-red-300 border-red-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'debug':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getLogRowColor = (level: string) => {
    switch (level) {
      case 'critical':
      case 'error':
        return 'border-l-red-500/50 bg-red-500/5';
      case 'warning':
        return 'border-l-amber-500/50 bg-amber-500/5';
      case 'debug':
        return 'border-l-purple-500/50 bg-purple-500/5';
      default:
        return 'border-l-blue-500/50 bg-blue-500/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">System Logs</h1>
          <p className="text-slate-400 mt-1">
            Monitor system activity and troubleshoot issues
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-800/50 border border-slate-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Levels</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-slate-800/50 border border-slate-600/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Level Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['debug', 'info', 'warning', 'error', 'critical'].map(level => {
          const count = logs.filter(log => log.level === level).length;
          return (
            <div key={level} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getLevelIcon(level)}
              </div>
              <p className="text-white font-semibold text-lg">{count}</p>
              <p className="text-slate-400 text-sm capitalize">{level}</p>
            </div>
          );
        })}
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-600/50">
              <tr>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Timestamp</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Level</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Source</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Message</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr 
                  key={log.id} 
                  className={`border-l-2 ${getLogRowColor(log.level)} ${
                    index % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/40'
                  } hover:bg-slate-700/30 transition-colors`}
                >
                  <td className="py-4 px-6 text-slate-300 font-mono text-sm">
                    {log.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(log.level)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-medium">{log.source}</td>
                  <td className="py-4 px-6 text-white">{log.message}</td>
                  <td className="py-4 px-6">
                    {log.data && (
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        View Details
                      </button>
                    )}
                    {log.workflowId && (
                      <span className="text-slate-400 text-xs">
                        Workflow: {log.workflowId}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No logs found matching your criteria</p>
          </div>
        </div>
      )}
    </div>
  );
}