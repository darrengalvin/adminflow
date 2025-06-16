import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  Users, 
  ArrowRight,
  CheckCircle,
  Lightbulb,
  BarChart3,
  Cog,
  Rocket,
  Award,
  Clock,
  DollarSign,
  Gift,
  Code,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface CAIOHomePageProps {
  onStartAnalysis: () => void;
  onNavigate: (section: string) => void;
}

export function CAIOHomePage({ onStartAnalysis, onNavigate }: CAIOHomePageProps) {
  const [showImplementationModal, setShowImplementationModal] = useState(false);

  const tools = [
    {
      id: 'task-analysis',
      title: 'AI Task Automation Analyzer',
      description: 'Discover which of your business tasks can be automated with AI and get detailed implementation plans.',
      icon: Brain,
      color: 'blue',
      action: () => onStartAnalysis(),
      benefits: ['Save 10-20 hours/week', 'ROI analysis included', 'Real API endpoints'],
      popular: true,
      free: true
    },
    {
      id: 'ai-readiness',
      title: 'AI Readiness Assessment',
      description: 'Evaluate your business readiness for AI implementation and get a strategic roadmap.',
      icon: Target,
      color: 'slate',
      action: () => onNavigate('ai-readiness'),
      benefits: ['Strategic roadmap', 'Risk assessment', 'Priority matrix'],
      comingSoon: true,
      free: true
    },
    {
      id: 'roi-calculator',
      title: 'AI ROI Calculator',
      description: 'Calculate the potential return on investment for AI initiatives in your business.',
      icon: DollarSign,
      color: 'emerald',
      action: () => onNavigate('roi-calculator'),
      benefits: ['Financial projections', 'Cost-benefit analysis', 'Timeline planning'],
      comingSoon: true,
      free: true
    },
    {
      id: 'workflow-builder',
      title: 'Custom Workflow Designer',
      description: 'Design and manage complex automation workflows with our visual builder.',
      icon: Cog,
      color: 'indigo',
      action: () => onNavigate('workflows'),
      benefits: ['Visual designer', 'Real-time monitoring', 'Custom integrations'],
      free: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 mb-6">
              <Sparkles className="h-4 w-4" />
              <span>🚀 Just Launched • Free AI Solutions • Custom Development Available</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Free AI Solutions That
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-700">
                Showcase Real Possibilities
              </span>
            </h1>
            
            {/* YOUR CAIO Explanation */}
            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">YOUR CAIO</h2>
                  <p className="text-sm text-gray-600 font-medium">Your Chief AI Officer</p>
                </div>
              </div>
              <p className="text-lg text-gray-700 text-center leading-relaxed">
                Think of us as your dedicated Chief AI Officer - we research, design, and build custom AI solutions 
                for your business. These free tools showcase our capabilities, and when you're ready, 
                we can create something specifically for your needs.
              </p>
            </div>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We build professional AI solutions and make them freely available to help businesses understand 
              what's possible. When you're ready for custom solutions, we can build them for you or provide 
              detailed specifications for your own development team.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onStartAnalysis}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Try Our Free AI Analyzer</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>100% Free • No signup • Professional results</span>
              </div>
            </div>


          </div>
        </div>
      </div>



      {/* Business Model Section */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Your CAIO Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in showing, not just telling. Our approach builds trust through value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                <Gift className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Free Tools First</h3>
              <p className="text-gray-600">
                We build professional AI tools and make them freely available so you can experience the quality of our work firsthand.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Growth</h3>
              <p className="text-gray-600">
                As businesses use our tools and see results, some naturally want custom solutions tailored to their specific needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-100">
                <Code className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Choice of Implementation</h3>
              <p className="text-gray-600">
                We can build your custom AI solution, or provide detailed technical specifications and documentation for your preferred development team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-700 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start with Our Free Tools
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience professional AI analysis at no cost. When you're ready for implementation, choose your preferred approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setActiveView('task-analysis')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>Try Our New AI Analyzer</span>
            </button>
            <button 
              onClick={() => setShowImplementationModal(true)}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Discuss Implementation Options</span>
            </button>
          </div>
        </div>
      </div>

      {/* Implementation Options Modal */}
      {showImplementationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Implementation Options</h3>
            <p className="text-gray-600 mb-6">
              When you're ready to implement custom AI solutions, you have complete flexibility in how you proceed:
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Option 1: We Build It For You</h4>
                <p className="text-gray-600">Your CAIO handles the complete development, deployment, and maintenance of your custom AI solution.</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Option 2: Detailed Technical Specifications</h4>
                <p className="text-gray-600">We provide comprehensive technical documentation, API specifications, and implementation guides for your development team.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowImplementationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowImplementationModal(false);
                  // Add contact logic here
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 