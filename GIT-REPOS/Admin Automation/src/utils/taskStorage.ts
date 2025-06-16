export interface AnalyzedTask {
  id: string;
  name: string;
  description: string;
  software: string;
  timeSpent: string;
  aiSuggestion: any;
  addedToWorkflow?: boolean;
  workflowName?: string;
  createdAt: string;
  category?: string;
  annualSavings?: number;
  weeklyHours?: number;
}

const STORAGE_KEY = 'analyzedTasks';

export const taskStorage = {
  // Save a new analyzed task
  saveTask: (task: Omit<AnalyzedTask, 'id' | 'createdAt'>): AnalyzedTask => {
    const tasks = taskStorage.getAllTasks();
    const newTask: AnalyzedTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    return newTask;
  },

  // Get all analyzed tasks
  getAllTasks: (): AnalyzedTask[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      return [];
    }
  },

  // Get available tasks (not yet added to workflows)
  getAvailableTasks: (): AnalyzedTask[] => {
    return taskStorage.getAllTasks().filter(task => !task.addedToWorkflow);
  },

  // Update a task (e.g., mark as added to workflow)
  updateTask: (taskId: string, updates: Partial<AnalyzedTask>): void => {
    const tasks = taskStorage.getAllTasks();
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  },

  // Delete a task
  deleteTask: (taskId: string): void => {
    const tasks = taskStorage.getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
  },

  // Clear all tasks
  clearAllTasks: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get tasks by workflow name
  getTasksByWorkflow: (workflowName: string): AnalyzedTask[] => {
    return taskStorage.getAllTasks().filter(task => task.workflowName === workflowName);
  },

  // Get task statistics
  getTaskStats: () => {
    const tasks = taskStorage.getAllTasks();
    const availableTasks = tasks.filter(task => !task.addedToWorkflow);
    const totalAnnualSavings = tasks.reduce((sum, task) => {
      const value = task.annualSavings || 0;
      return sum + value;
    }, 0);
    const totalWeeklyHours = tasks.reduce((sum, task) => {
      const hours = task.weeklyHours || 0;
      return sum + hours;
    }, 0);

    return {
      totalTasks: tasks.length,
      availableTasks: availableTasks.length,
      tasksInWorkflows: tasks.length - availableTasks.length,
      totalAnnualSavings,
      totalWeeklyHours,
    };
  }
}; 