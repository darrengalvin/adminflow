import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Database, Settings, HelpCircle } from 'lucide-react';
import { MobileNavigation } from './components/MobileNavigation';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { Dashboard } from './components/Dashboard';
import { WorkflowManager } from './components/WorkflowManager';
import { WorkflowDesigner } from './components/WorkflowDesigner';
import { AutomationMonitor } from './components/AutomationMonitor';
import { APIIntegrations } from './components/APIIntegrations';
import { SystemLogs } from './components/SystemLogs';
import TaskAnalysis from './components/TaskAnalysis';
import { Showcase } from './components/Showcase';
import { Reports } from './components/Reports';
import { ReportHistory } from './components/ReportHistory';
import { SectionedReportBuilder } from './components/SectionedReportBuilder';
import { workflowEngine } from './services/workflowEngine';
import { 
  mockWorkflows, 
  mockAPIIntegrations, 
  mockKPIs, 
  mockLogs, 
  mockNotifications 
} from './services/mockData';
import { Notification, Workflow } from './types';
import { CAIOHomePage } from './components/CAIOHomePage';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isMobile, setIsMobile] = useState(false);

  // Load workflows from localStorage on app start
  useEffect(() => {
    try {
      // First, migrate any workflows from old 'workflows' key to new 'automationWorkflows' key
      const oldWorkflows = localStorage.getItem('workflows');
      const newWorkflows = localStorage.getItem('automationWorkflows');
      
      if (oldWorkflows && !newWorkflows) {
        console.log('🔄 Migrating workflows from old storage format...');
        const oldWorkflowsList = JSON.parse(oldWorkflows) as Workflow[];
        const workflowsData = oldWorkflowsList.reduce((acc, workflow) => {
          acc[workflow.id] = workflow;
          return acc;
        }, {} as Record<string, Workflow>);
        localStorage.setItem('automationWorkflows', JSON.stringify(workflowsData));
        localStorage.removeItem('workflows'); // Clean up old storage
        console.log('✅ Migrated', oldWorkflowsList.length, 'workflows to new format');
      }

      // Load workflows from the correct key
      const savedWorkflows = localStorage.getItem('automationWorkflows');
      if (savedWorkflows) {
        const workflowsData = JSON.parse(savedWorkflows);
        const workflowsList = Object.values(workflowsData) as Workflow[];
        console.log('🚀 App startup: Loaded', workflowsList.length, 'workflows from localStorage');
        setWorkflows(workflowsList);
      }
    } catch (error) {
      console.error('Error loading workflows on app startup:', error);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize workflows in the engine
  useEffect(() => {
    workflows.forEach(workflow => {
      workflowEngine.addWorkflow(workflow);
    });
  }, []);

  const handleWorkflowExecute = async (workflowId: string) => {
    try {
      // Update workflow status to running
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { ...w, status: 'active' as const, progress: 0 }
          : w
      ));

      // Add notification
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: 'info',
        title: 'Workflow Started',
        message: `Workflow ${workflowId} has been initiated`,
        timestamp: new Date(),
        read: false,
        workflowId
      };
      setNotifications(prev => [newNotification, ...prev]);

      // Execute workflow
      await workflowEngine.executeWorkflow(workflowId);
      
      // Update workflow with final status
      const updatedWorkflow = workflowEngine.getWorkflow(workflowId);
      if (updatedWorkflow) {
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId ? updatedWorkflow : w
        ));

        // Add completion notification
        const completionNotification: Notification = {
          id: `notif-${Date.now()}-complete`,
          type: updatedWorkflow.status === 'completed' ? 'success' : 'error',
          title: updatedWorkflow.status === 'completed' ? 'Workflow Completed' : 'Workflow Failed',
          message: `Workflow ${workflowId} has ${updatedWorkflow.status}`,
          timestamp: new Date(),
          read: false,
          workflowId
        };
        setNotifications(prev => [completionNotification, ...prev]);
      }
    } catch (error) {
      console.error('Workflow execution failed:', error);
      
      // Add error notification
      const errorNotification: Notification = {
        id: `notif-${Date.now()}-error`,
        type: 'error',
        title: 'Workflow Error',
        message: `Failed to execute workflow ${workflowId}`,
        timestamp: new Date(),
        read: false,
        workflowId
      };
      setNotifications(prev => [errorNotification, ...prev]);
    }
  };

  const handleWorkflowSave = (workflow: Workflow) => {
    setWorkflows(prev => {
      const existingIndex = prev.findIndex(w => w.id === workflow.id);
      let updatedWorkflows;
      
      if (existingIndex >= 0) {
        // Update existing workflow
        updatedWorkflows = [...prev];
        updatedWorkflows[existingIndex] = workflow;
      } else {
        // Add new workflow
        updatedWorkflows = [...prev, workflow];
      }

      // Save to localStorage
      try {
        const workflowsData = updatedWorkflows.reduce((acc, w) => {
          acc[w.id] = w;
          return acc;
        }, {} as Record<string, Workflow>);
        localStorage.setItem('automationWorkflows', JSON.stringify(workflowsData));
        console.log('💾 Saved workflow to localStorage:', workflow.name);
      } catch (error) {
        console.error('Error saving workflows to localStorage:', error);
      }

      return updatedWorkflows;
    });

    // Add to workflow engine
    workflowEngine.addWorkflow(workflow);

    // Add notification
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'success',
      title: 'Workflow Saved',
      message: `Workflow "${workflow.name}" has been saved successfully`,
      timestamp: new Date(),
      read: false,
      workflowId: workflow.id
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const handleStartAnalysis = () => {
    setCurrentSection('analyze');
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'home':
        return <CAIOHomePage onStartAnalysis={handleStartAnalysis} onNavigate={setCurrentSection} />;
      case 'analyze':
        return (
          <TaskAnalysis 
            onBack={() => setCurrentSection('home')}
            onAddWorkflow={(workflow) => setWorkflows([...workflows, workflow])} 
            onNavigate={setCurrentSection}
          />
        );
      case 'showcase':
        return <Showcase onBack={() => setCurrentSection('home')} />;
      case 'dashboard':
        return (
          <Dashboard 
            kpis={mockKPIs}
            workflows={workflows}
            onWorkflowClick={(workflowId) => setCurrentSection('workflows')}
            onStartAnalysis={handleStartAnalysis}
          />
        );
      case 'workflows':
        return (
          <WorkflowDesigner 
            workflows={workflows}
            onNavigateToAnalysis={() => setCurrentSection('analyze')}
            onWorkflowSave={handleWorkflowSave}
            onWorkflowExecute={handleWorkflowExecute}
          />
        );
      case 'reports':
        return <Reports />;
      case 'report-history':
        return <ReportHistory onNavigate={setCurrentSection} />;
      case 'sectioned-report-builder':
        return <SectionedReportBuilder />;
      case 'integrations':
        return <APIIntegrations integrations={mockAPIIntegrations} />;
      case 'logs':
        return <SystemLogs logs={mockLogs} />;
      case 'analytics':
        return (
          <div className="card p-12 text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--color-accent-primary)' }} />
            <h2 className="heading-2 mb-4">Analytics Dashboard</h2>
            <p className="body-text mb-6">Get comprehensive insights into your automation performance</p>
            <div className="text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-secondary)' }}></div>
                <span className="small-text">Process efficiency metrics</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-primary)' }}></div>
                <span className="small-text">ROI calculations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-warning)' }}></div>
                <span className="small-text">Predictive insights</span>
              </div>
            </div>
          </div>
        );
      case 'monitoring':
        return (
          <div className="card p-12 text-center">
            <Activity className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--color-accent-secondary)' }} />
            <h2 className="heading-2 mb-4">System Monitoring</h2>
            <p className="body-text mb-6">Real-time health monitoring and alerting for all your automation workflows</p>
            <div className="text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--status-success)' }}></div>
                <span className="small-text">System health checks</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--status-info)' }}></div>
                <span className="small-text">Performance tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--status-warning)' }}></div>
                <span className="small-text">Proactive alerting</span>
              </div>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="card p-12 text-center">
            <Database className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--color-accent-warning)' }} />
            <h2 className="heading-2 mb-4">Data Management</h2>
            <p className="body-text mb-6">Centralized data synchronization and management across all integrations</p>
            <div className="text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-primary)' }}></div>
                <span className="small-text">Data synchronization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-secondary)' }}></div>
                <span className="small-text">Master data management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-warning)' }}></div>
                <span className="small-text">Data validation</span>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="card p-12 text-center">
            <Settings className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--text-secondary)' }} />
            <h2 className="heading-2 mb-4">Settings</h2>
            <p className="body-text mb-6">Configure your automation platform to match your business needs</p>
            <div className="text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-primary)' }}></div>
                <span className="small-text">System configuration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-secondary)' }}></div>
                <span className="small-text">User preferences</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-warning)' }}></div>
                <span className="small-text">Integration settings</span>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="card p-12 text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--color-accent-primary)' }} />
            <h2 className="heading-2 mb-4">Help & Support</h2>
            <p className="body-text mb-6">Get the guidance you need to maximize your automation success</p>
            <div className="text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-primary)' }}></div>
                <span className="small-text">Step-by-step tutorials</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-secondary)' }}></div>
                <span className="small-text">Best practices guide</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-warning)' }}></div>
                <span className="small-text">24/7 support</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard 
            kpis={mockKPIs}
            workflows={workflows}
            onWorkflowClick={(workflowId) => setCurrentSection('workflows')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? (
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 overflow-auto">
            <div className="content-area">
              {renderContent()}
            </div>
          </div>
          <MobileNavigation 
            currentSection={currentSection} 
            onNavigate={setCurrentSection}
          />
        </div>
      ) : (
        <div className="flex">
          <Sidebar 
            currentSection={currentSection} 
            onNavigate={setCurrentSection}
          />
          <div className="flex-1 ml-64">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;