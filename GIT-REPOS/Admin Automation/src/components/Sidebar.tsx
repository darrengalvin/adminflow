import React from 'react';
import { 
  Home, 
  Brain, 
  Zap, 
  Settings, 
  Sparkles,
  Award
} from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export function Sidebar({ currentSection, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analyze', label: 'AI Task Analyser', icon: Brain },
    { id: 'workflows', label: 'Workflow Designer', icon: Zap },
    { id: 'showcase', label: 'Showcase', icon: Sparkles },
    { id: 'integrations', label: 'Integrations', icon: Settings },
  ];

  const handleBookStrategy = () => {
    // Open Calendly or external booking link
    window.open('https://calendly.com/your-caio/strategy-session', '_blank');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-40">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-slate-700 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Your CAIO</h1>
              <p className="text-xs text-gray-500">Chief AI Officer Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
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
          </nav>
        </div>

        {/* CTA Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">Ready to Build Your Solution?</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Get a bespoke automation strategy session with YOUR CAIO. We'll analyse your specific processes and create a detailed implementation roadmap.
            </p>
            <button 
              onClick={handleBookStrategy}
              className="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Strategy Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}