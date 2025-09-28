import React from 'react';

interface PhaseHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  isActive: boolean;
}

export function PhaseHeader({ title, description, icon, progress, isActive }: PhaseHeaderProps) {
  return (
    <div className={`p-6 border-b border-gray-100 ${isActive ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className={`text-lg font-semibold ${isActive ? 'text-blue-800' : 'text-gray-800'}`}>
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`text-sm font-medium ${isActive ? 'text-blue-800' : 'text-gray-800'}`}>
              {Math.round(progress)}% Complete
            </div>
            {progress === 100 && (
              <div className="text-xs text-green-600 font-medium">
                ✓ Phase Complete
              </div>
            )}
          </div>
          
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                progress === 100 ? 'bg-green-500' : isActive ? 'bg-blue-600' : 'bg-gray-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 