import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GlobalActivity, ActivityStats, ActivityContextType } from '../types/activity';

const ActivityContext = createContext<ActivityContextType | null>(null);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<GlobalActivity[]>([]);

  // Calculate stats from activities
  const stats: ActivityStats = {
    total: activities.length,
    running: activities.filter(a => a.status === 'running').length,
    queued: activities.filter(a => a.status === 'queued').length,
    completed: activities.filter(a => a.status === 'completed').length,
    failed: activities.filter(a => a.status === 'failed').length
  };

  // Auto-remove completed activities after 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => 
        prev.filter(activity => {
          if (activity.status === 'completed') {
            const timeSinceCompletion = Date.now() - activity.startTime.getTime();
            return timeSinceCompletion < 30000; // Keep for 30 seconds
          }
          return true;
        })
      );
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate progress updates for running activities
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => 
        prev.map(activity => {
          if (activity.status === 'running' && activity.progress < 100) {
            // Simulate realistic progress increments
            const increment = Math.random() * 5 + 1; // 1-6% increment
            const newProgress = Math.min(activity.progress + increment, 100);
            
            // Auto-complete when reaching 100%
            if (newProgress >= 100) {
              return {
                ...activity,
                progress: 100,
                status: 'completed' as const,
                stage: 'Completed',
                details: 'Process completed successfully'
              };
            }
            
            return {
              ...activity,
              progress: newProgress
            };
          }
          return activity;
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const addActivity = (activityData: Omit<GlobalActivity, 'id' | 'startTime'>): string => {
    const id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newActivity: GlobalActivity = {
      ...activityData,
      id,
      startTime: new Date()
    };

    setActivities(prev => [...prev, newActivity]);
    return id;
  };

  const updateActivity = (id: string, updates: Partial<GlobalActivity>) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, ...updates }
          : activity
      )
    );
  };

  const removeActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const clearCompleted = () => {
    setActivities(prev => prev.filter(activity => activity.status !== 'completed'));
  };

  const pauseActivity = (id: string) => {
    updateActivity(id, { status: 'paused' });
  };

  const resumeActivity = (id: string) => {
    updateActivity(id, { status: 'running' });
  };

  const contextValue: ActivityContextType = {
    activities,
    stats,
    addActivity,
    updateActivity,
    removeActivity,
    clearCompleted,
    pauseActivity,
    resumeActivity
  };

  return (
    <ActivityContext.Provider value={contextValue}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}; 