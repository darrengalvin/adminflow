import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPI } from '../types';
import * as LucideIcons from 'lucide-react';

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  const IconComponent = (LucideIcons as any)[kpi.icon] || LucideIcons.Activity;
  
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (kpi.trend) {
      case 'up':
        return kpi.id === 'error-rate' ? '#ff6b6b' : '#34c759';
      case 'down':
        return kpi.id === 'error-rate' ? '#34c759' : '#ff6b6b';
      default:
        return 'var(--text-tertiary)';
    }
  };

  const getCardBackground = () => {
    switch (kpi.id) {
      case 'automation-rate':
        return 'linear-gradient(135deg, #4285f4 0%, #6ba3ff 100%)';
      case 'time-saved':
        return 'linear-gradient(135deg, #34c759 0%, #66d17a 100%)';
      case 'error-rate':
        return 'linear-gradient(135deg, #ff6b6b 0%, #ff8a8a 100%)';
      case 'cost-savings':
        return 'linear-gradient(135deg, #ff9f40 0%, #ffb366 100%)';
      default:
        return 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
    }
  };

  return (
    <div 
      className="card p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group"
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: getCardBackground() }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: getCardBackground() }}
            >
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <h3 className="body-text font-medium">{kpi.name}</h3>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
            </span>
            <span className="small-text" style={{ color: 'var(--text-tertiary)' }}>
              {kpi.unit}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div 
              className="flex items-center space-x-1 px-2 py-1 rounded-full"
              style={{ 
                background: kpi.trend === 'up' && kpi.id !== 'error-rate' ? 'var(--status-success-bg)' :
                           kpi.trend === 'down' && kpi.id === 'error-rate' ? 'var(--status-success-bg)' :
                           kpi.trend === 'up' && kpi.id === 'error-rate' ? 'var(--status-error-bg)' :
                           kpi.trend === 'down' && kpi.id !== 'error-rate' ? 'var(--status-error-bg)' :
                           'var(--bg-tertiary)'
              }}
            >
              <span style={{ color: getTrendColor() }}>
                {getTrendIcon()}
              </span>
              <span 
                className="text-sm font-medium"
                style={{ color: getTrendColor() }}
              >
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </span>
            </div>
            <span className="small-text" style={{ color: 'var(--text-tertiary)' }}>
              vs last week
            </span>
          </div>
        </div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
          <div 
            className="w-full h-full rounded-full"
            style={{ background: getCardBackground() }}
          />
        </div>
      </div>
    </div>
  );
}