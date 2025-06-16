import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Code, 
  Brain, 
  Layers, 
  ArrowRight,
  CheckCircle,
  Target,
  Lightbulb
} from 'lucide-react';

interface HomePageProps {
  onStartAnalysis: () => void;
}

export function HomePage({ onStartAnalysis }: HomePageProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium"
             style={{ 
               background: 'var(--color-accent-primary)', 
               color: 'var(--text-inverse)' 
             }}>
          <Zap className="h-4 w-4" />
          <span>Custom Automation Platform</span>
        </div>
        
        <h1 className="heading-1 max-w-4xl mx-auto">
          Build Your Own <span style={{ color: 'var(--color-accent-primary)' }}>Automation Empire</span>
          <br />Not Just Another Workflow Tool
        </h1>
        
        <p className="body-text-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          This isn't about connecting to Make.com or n8n. This is about building custom, AI-powered internal tools 
          that become valuable business assets, scale with your growth, and uncover new opportunities as AI evolves.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onStartAnalysis}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Start Building Your Asset</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <CheckCircle className="h-4 w-4" style={{ color: 'var(--status-success)' }} />
            <span>No external dependencies • Full ownership</span>
          </div>
        </div>
      </div>

      {/* Why This Approach */}
      <div className="card p-8">
        <div className="text-center mb-8">
          <Target className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-accent-primary)' }} />
          <h2 className="heading-2 mb-4">Why Build Internal Tools Instead of Using Standard Automation?</h2>
          <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
            Standard automation platforms are great for connecting existing tools, but they don't create lasting business value.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="heading-3" style={{ color: 'var(--status-error)' }}>Standard Automation Platforms</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--status-error)' }}></div>
                <div>
                  <p className="font-medium">Monthly subscription costs</p>
                  <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
                    Ongoing expenses that scale with usage
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--status-error)' }}></div>
                <div>
                  <p className="font-medium">Limited customization</p>
                  <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
                    Constrained by platform capabilities
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--status-error)' }}></div>
                <div>
                  <p className="font-medium">No business asset creation</p>
                  <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
                    You're renting, not building
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--status-error)' }}></div>
                <div>
                  <p className="font-medium">Vendor lock-in</p>
                  <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
                    Dependent on external platforms
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="heading-3" style={{ color: 'var(--status-success)' }}>Custom Internal Tools</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--status-success)' }}></div>
                <div>
                  <p className="font-medium">One-time development investment</p>
                  <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
                    Build once, own forever
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--status-success)' }}></div>
                <div>
                  <p className="font-medium">Unlimited customization</p>
                  <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
                    Tailored exactly to your needs
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--status-success)' }}></div>
                <div>
                  <p className="font-medium">Valuable business asset</p>
                  <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
                    Increases company valuation
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--status-success)' }}></div>
                <div>
                  <p className="font-medium">Full control & ownership</p>
                  <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
                    Your code, your rules
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-accent-primary)' }} />
          <h3 className="heading-3 mb-3">Scalable Business Asset</h3>
          <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
            Every tool you build becomes a permanent part of your business infrastructure, 
            increasing in value as your company grows.
          </p>
        </div>

        <div className="card p-6 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-accent-secondary)' }} />
          <h3 className="heading-3 mb-3">AI-First Architecture</h3>
          <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
            Built to evolve with AI advancements, uncovering new automation opportunities 
            and optimization strategies as technology progresses.
          </p>
        </div>

        <div className="card p-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-accent-warning)' }} />
          <h3 className="heading-3 mb-3">Complete Control</h3>
          <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
            No vendor dependencies, no monthly fees, no platform limitations. 
            Your automation, your data, your competitive advantage.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="card p-8">
        <div className="text-center mb-8">
          <Lightbulb className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-accent-primary)' }} />
          <h2 className="heading-2 mb-4">How We Build Your Automation Empire</h2>
          <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
            A systematic approach to identifying, analyzing, and automating your business processes
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
                 style={{ background: 'var(--color-accent-primary)' }}>
              1
            </div>
            <h4 className="font-semibold mb-2">Task Discovery</h4>
            <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
              Identify repetitive tasks and manual processes in your business
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
                 style={{ background: 'var(--color-accent-secondary)' }}>
              2
            </div>
            <h4 className="font-semibold mb-2">AI Analysis</h4>
            <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
              Advanced AI evaluates automation potential and ROI
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
                 style={{ background: 'var(--color-accent-warning)' }}>
              3
            </div>
            <h4 className="font-semibold mb-2">Custom Development</h4>
            <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
              Build tailored automation tools specific to your needs
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
                 style={{ background: 'var(--status-success)' }}>
              4
            </div>
            <h4 className="font-semibold mb-2">Scale & Optimize</h4>
            <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
              Continuously improve and expand your automation ecosystem
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card p-8">
        <div className="text-center mb-8">
          <Code className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-accent-primary)' }} />
          <h2 className="heading-2 mb-4">Built on Modern, Reliable Technology</h2>
          <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
            Enterprise-grade tools and frameworks that ensure your automation platform is robust, secure, and future-proof
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
            <Layers className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-accent-primary)' }} />
            <h4 className="font-semibold mb-2">React & TypeScript</h4>
            <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
              Modern, type-safe frontend development
            </p>
          </div>

          <div className="text-center p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
            <Brain className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-accent-secondary)' }} />
            <h4 className="font-semibold mb-2">AI Integration</h4>
            <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
              Advanced AI for process analysis
            </p>
          </div>

          <div className="text-center p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
            <Shield className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-accent-warning)' }} />
            <h4 className="font-semibold mb-2">Secure APIs</h4>
            <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
              Enterprise-level security standards
            </p>
          </div>

          <div className="text-center p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
            <TrendingUp className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--status-success)' }} />
            <h4 className="font-semibold mb-2">Scalable Architecture</h4>
            <p className="small-text" style={{ color: 'var(--text-secondary)' }}>
              Built to grow with your business
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card p-8 text-center" style={{ background: 'var(--color-accent-primary)' }}>
        <h2 className="heading-2 mb-4" style={{ color: 'var(--text-inverse)' }}>
          Ready to Build Your Automation Empire?
        </h2>
        <p className="body-text mb-6" style={{ color: 'var(--text-inverse)', opacity: 0.9 }}>
          Start by analyzing your current tasks and discovering automation opportunities. 
          Every journey begins with understanding where you are.
        </p>
        <button
          onClick={onStartAnalysis}
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
        >
          <span>Begin Task Analysis</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 