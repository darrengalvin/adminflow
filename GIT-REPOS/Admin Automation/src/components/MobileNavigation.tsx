import React, { useState } from 'react';
import { 
  Home, 
  Brain, 
  BarChart3, 
  Zap, 
  Menu, 
  X,
  Monitor,
  Settings,
  Award,
  FileText
} from 'lucide-react';

interface MobileNavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export function MobileNavigation({ currentSection, onNavigate }: MobileNavigationProps) {
  const [showMenu, setShowMenu] = useState(false);

  const mainTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analyze', label: 'Analyze', icon: Brain },
    { id: 'workflows', label: 'Workflows', icon: Zap },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  const allMenuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analyze', label: 'AI Task Analyser', icon: Brain },
    { id: 'workflows', label: 'Workflow Designer', icon: Zap },
    { id: 'reports', label: 'AI Reports', icon: FileText },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'monitor', label: 'Monitor', icon: Monitor },
    { id: 'integrations', label: 'Integrations', icon: Settings },
  ];



  const handleNavigate = (section: string) => {
    onNavigate(section);
    setShowMenu(false);
  };

  const handleBookStrategy = () => {
    // Open Calendly or external booking link
    window.open('https://calendly.com/your-caio/strategy-session', '_blank');
    setShowMenu(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-slate-700 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Your CAIO</h1>
            </div>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Tablet Header */}
      <div className="hidden md:block lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-slate-700 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Your CAIO</h1>
              <p className="text-xs text-gray-500">Chief AI Officer Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentSection === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigate(tab.id)}
                  className={`touch-target flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="touch-target p-2 rounded-lg hover:bg-gray-100 transition-colors ml-2"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentSection === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                className={`touch-target flex flex-col items-center space-y-1 py-2 px-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlay Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-slate-700 rounded-xl flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Your CAIO</h2>
                      <p className="text-xs text-gray-500">Chief AI Officer Platform</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      AI Tools
                    </h3>
                    <div className="space-y-1">
                      {allMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentSection === item.id;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span className="font-medium">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">Professional AI Consulting</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Get personalised AI strategy and implementation support.
                  </p>
                  <button 
                    onClick={handleBookStrategy}
                    className="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 