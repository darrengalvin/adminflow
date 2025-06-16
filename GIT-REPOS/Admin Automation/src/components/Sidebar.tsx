import React from 'react';
import { 
  Home, 
  Brain, 
  Settings, 
  Zap, 
  Target,
  DollarSign,
  Award,
  Sparkles
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

  const comingSoonItems = [
    { id: 'ai-readiness', label: 'AI Readiness Assessment', icon: Target },
    { id: 'roi-calculator', label: 'ROI Calculator', icon: DollarSign },
  ];

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
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              AI Tools
            </h3>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Coming Soon
            </h3>
            {comingSoonItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <div
                  key={item.id}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 cursor-not-allowed"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">Soon</span>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">Professional AI Consulting</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Get personalized AI strategy and implementation support.
            </p>
            <button className="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}