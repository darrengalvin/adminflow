import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Gift, 
  Users, 
  Code, 
  Zap, 
  MessageSquare,
  Clock,
  Cog,
  BarChart3,
  Shield
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
      title: 'AI Task Analyser',
      description: 'Discover automation opportunities in your daily operations with intelligent analysis.',
      icon: BarChart3,
      color: 'blue'
    },
    {
      id: 'workflow-designer',
      title: 'Workflow Designer',
      description: 'Build and visualise automated workflows with our intuitive drag-and-drop interface.',
      icon: Cog,
      color: 'emerald'
    },
    {
      id: 'integration-monitor',
      title: 'Integration Monitor',
      description: 'Track and manage your automation performance with real-time monitoring.',
      icon: Shield,
      color: 'indigo'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Launch Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-slate-200">
        <div className="px-6 py-3">
          <div className="flex items-center justify-center space-x-2 text-sm font-medium text-slate-700">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700">🚀 Just Launched</span>
              <span>•</span>
              <span>Free AI Analyser</span>
              <span>•</span>
              <span>End-to-End AI Solutions Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Improved Layout */}
      <div className="relative py-20 lg:py-32">
        <div className="px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Your Complete AI
                <span className="block text-blue-600 mt-2">
                  Transformation Partner
                </span>
              </h1>
              
              {/* YOUR CAIO Explanation Card */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 mb-8 mx-auto shadow-sm border border-slate-200 max-w-4xl">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">AI</span>
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-slate-900">YOUR CAIO</h2>
                    <p className="text-slate-600 font-medium">Your Chief AI Officer</p>
                  </div>
                </div>
                <p className="text-lg text-slate-700 leading-relaxed">
                  We're your dedicated Chief AI Officer - handling everything from initial strategy and planning 
                  to full implementation and ongoing support. From idea to execution, we guide your complete AI transformation.
                </p>
              </div>
              
              {/* Value Proposition */}
              <p className="text-xl text-slate-600 mb-16 leading-relaxed max-w-4xl mx-auto">
                We specialise in complete AI transformation - from initial strategy and research through to full 
                implementation and ongoing support. Whether you need custom development or detailed specifications for 
                your team, we ensure your AI initiatives succeed with measurable results.
              </p>
            </div>

            {/* Process Explanation Section - Full Width Layout */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Most Common Question</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-4">
                  "What can AI actually do for my business?"
                </h3>
                <p className="text-slate-600 mb-8 max-w-3xl mx-auto">
                  When asked this question, we typically start by analysing your day-to-day tasks. 
                  We've built a free tool to help you discover automation opportunities instantly.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Process Steps */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-lg">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900 font-semibold mb-2 text-lg">We analyse your tasks</h4>
                      <p className="text-slate-600 leading-relaxed">
                        Review your day-to-day operations and identify automation opportunities with detailed analysis
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-lg">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900 font-semibold mb-2 text-lg">Generate detailed report</h4>
                      <p className="text-slate-600 leading-relaxed">
                        Provide specific automation recommendations with ROI calculations and implementation priorities
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-lg">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900 font-semibold mb-2 text-lg">Implementation roadmap</h4>
                      <p className="text-slate-600 leading-relaxed">
                        Clear next steps and technical requirements with timeline and resource planning
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Tool Highlight with Integrated CTA */}
                <div className="bg-slate-50 rounded-xl p-6 lg:p-8 border border-slate-200">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-slate-900 font-semibold mb-3 text-xl">Free Analysis Tool</h4>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Get instant insights into your automation potential. Professional analysis with no signup required, no sales calls.
                    </p>
                    
                    {/* Integrated CTA Button */}
                    <button
                      onClick={onStartAnalysis}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2 mb-4 text-lg"
                    >
                      <Sparkles className="h-5 w-5" />
                      <span>Start Your AI Analysis</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>Professional analysis</span>
                      <span>•</span>
                      <span>Immediate results</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How We Work Section - Full Width */}
      <div className="py-20 bg-white">
        <div className="px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How Your CAIO Works</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                We believe in showing, not just telling. Our approach builds trust through value.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 group-hover:bg-emerald-100 transition-colours duration-200">
                  <Gift className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Free Tools First</h3>
                <p className="text-slate-600 leading-relaxed">
                  We build professional AI tools and make them freely available so you can experience the quality of our work firsthand.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 group-hover:bg-blue-100 transition-colours duration-200">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Community Growth</h3>
                <p className="text-slate-600 leading-relaxed">
                  As businesses use our tools and see results, some naturally want custom solutions tailored to their specific needs.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-100 group-hover:bg-indigo-100 transition-colours duration-200">
                  <Code className="h-10 w-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Your Choice of Implementation</h3>
                <p className="text-slate-600 leading-relaxed">
                  We can build your custom AI solution, or provide detailed technical specifications and documentation for your preferred development team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 py-20">
        <div className="px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Start with Our Free Tools
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Experience professional AI analysis at no cost. When you're ready for implementation, choose your preferred approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onStartAnalysis()}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colours duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Zap className="h-5 w-5 text-white" />
                <span className="text-white">Try Our Free AI Analyser</span>
              </button>
              <button 
                onClick={() => setShowImplementationModal(true)}
                className="px-8 py-4 border-2 border-slate-500 text-white hover:text-white rounded-xl font-semibold hover:border-slate-400 hover:bg-slate-700 transition-colours duration-200 flex items-center justify-center space-x-2 bg-slate-800"
              >
                <MessageSquare className="h-5 w-5 text-white" />
                <span className="text-white">Discuss Implementation Options</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Options Modal */}
      {showImplementationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Implementation Options</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              When you're ready to implement custom AI solutions, you have complete flexibility in how you proceed:
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colours duration-200">
                <h4 className="font-semibold text-slate-900 mb-2">Option 1: We Build It For You</h4>
                <p className="text-slate-600 leading-relaxed">Your CAIO handles the complete development, deployment, and maintenance of your custom AI solution.</p>
              </div>
              
              <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colours duration-200">
                <h4 className="font-semibold text-slate-900 mb-2">Option 2: Detailed Technical Specifications</h4>
                <p className="text-slate-600 leading-relaxed">We provide comprehensive technical documentation, API specifications, and implementation guides for your development team.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowImplementationModal(false)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colours duration-200 font-medium"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowImplementationModal(false);
                  // Add contact logic here
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colours duration-200 font-medium"
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