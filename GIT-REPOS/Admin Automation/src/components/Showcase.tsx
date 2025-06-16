import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  Users, 
  Calendar,
  MessageSquare,
  ExternalLink,
  Play,
  Award,
  TrendingUp,
  Shield,
  Zap,
  Brain,
  Target,
  Globe
} from 'lucide-react';

interface ShowcaseProps {
  onBack: () => void;
}

interface Platform {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  image: string;
  features: string[];
  challenges: {
    title: string;
    description: string;
    solution: string;
  }[];
  metrics: {
    label: string;
    value: string;
    icon: React.ElementType;
  }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  techStack: string[];
  timeline: string;
  investment: string;
  roi: string;
  status: 'live' | 'beta' | 'development';
}

const platforms: Platform[] = [
  {
    id: 'koala-accounting',
    name: 'Koala Accounting',
    tagline: 'Smart Financial Management Made Simple',
    description: 'A comprehensive accounting platform designed for modern businesses. Features automated bookkeeping, intelligent expense tracking, real-time financial reporting, and seamless integration with banking systems for complete financial visibility.',
    category: 'Financial Technology & Accounting',
    image: 'https://firebasestorage.googleapis.com/v0/b/yourcaio-649fe.firebasestorage.app/o/koalashot1.png?alt=media&token=19c0236c-4c38-40e7-8765-1c5c1434e29b',
    features: [
      'Automated Bookkeeping & Transaction Categorization',
      'Real-time Financial Reporting & Analytics',
      'Bank Account Integration & Reconciliation',
      'Intelligent Expense Tracking & Management',
      'Invoice Generation & Payment Processing',
      'Tax Preparation & Compliance Tools',
      'Multi-currency Support & Exchange Rates',
      'Advanced Security & Data Encryption'
    ],
    challenges: [
      {
        title: 'Complex Financial Data Integration',
        description: 'Integrating with multiple banking systems and financial institutions while maintaining data accuracy and security.',
        solution: 'Built robust API integration layer with bank-grade security protocols and automated data validation systems.'
      },
      {
        title: 'Real-time Financial Reconciliation',
        description: 'Providing instant financial reconciliation across multiple accounts and transaction types with high accuracy.',
        solution: 'Developed advanced reconciliation engine using machine learning algorithms to match transactions with 99.8% accuracy.'
      },
      {
        title: 'Scalable Reporting & Analytics',
        description: 'Generating complex financial reports and analytics in real-time for businesses of varying sizes and complexity.',
        solution: 'Created modular reporting system with customizable dashboards and automated insight generation for actionable intelligence.'
      }
    ],
    metrics: [
      { label: 'Processing Accuracy', value: '99.8%', icon: CheckCircle },
      { label: 'Time Savings', value: '-78%', icon: Calendar },
      { label: 'Cost Reduction', value: '-65%', icon: TrendingUp },
      { label: 'Client Satisfaction', value: '4.9/5', icon: Star }
    ],
    testimonial: {
      quote: "Koala Accounting transformed our financial operations completely. The automated reconciliation alone saves us 20+ hours per week, and the real-time insights have improved our decision-making dramatically. It's been a game-changer for our business efficiency.",
      author: "David Chen",
      role: "Finance Director",
      company: "TechStart Solutions Ltd"
    },
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Banking APIs', 'Machine Learning', 'AWS', 'Redis', 'TypeScript'],
    timeline: '10 months',
    investment: '£58,000',
    roi: '385% in 2 years',
    status: 'live'
  },
  {
    id: 'planaroo',
    name: 'Planaroo',
    tagline: 'AI-Powered Event Planning & Management Platform',
    description: 'A comprehensive event planning platform that streamlines venue booking, vendor coordination, and guest management. Features intelligent matching algorithms, automated scheduling, and real-time collaboration tools for seamless event execution.',
    category: 'Event Management & Planning',
    image: 'https://firebasestorage.googleapis.com/v0/b/yourcaio-649fe.firebasestorage.app/o/planarooshot.png?alt=media&token=bc24df5b-5ec6-4a43-8fb1-74425723f114',
    features: [
      'Intelligent Venue Matching & Availability',
      'Automated Vendor Coordination & Booking',
      'Real-time Guest Management & RSVP Tracking',
      'Smart Budget Planning & Cost Optimization',
      'Integrated Payment Processing & Invoicing',
      'Multi-event Timeline Management',
      'Collaborative Planning Tools & Permissions',
      'Mobile-first Design & Offline Capabilities'
    ],
    challenges: [
      {
        title: 'Complex Vendor Coordination',
        description: 'Managing multiple vendors, their availability, pricing, and requirements across different event types and dates.',
        solution: 'Built intelligent vendor matching system with automated scheduling, conflict resolution, and real-time availability updates.'
      },
      {
        title: 'Dynamic Event Requirements',
        description: 'Events constantly change scope, guest count, and requirements, making planning and budgeting extremely complex.',
        solution: 'Developed adaptive planning engine that automatically adjusts budgets, vendor requirements, and timelines based on changes.'
      },
      {
        title: 'Multi-stakeholder Collaboration',
        description: 'Event planning involves multiple decision-makers, each with different priorities and approval processes.',
        solution: 'Created role-based collaboration system with approval workflows, real-time notifications, and transparent decision tracking.'
      }
    ],
    metrics: [
      { label: 'Planning Time', value: '-75%', icon: Calendar },
      { label: 'Event Success Rate', value: '96%', icon: CheckCircle },
      { label: 'Cost Savings', value: '£12K avg', icon: TrendingUp },
      { label: 'Client Satisfaction', value: '4.9/5', icon: Star }
    ],
    testimonial: {
      quote: "Planaroo revolutionized our event planning process. What used to take weeks of back-and-forth emails now happens in hours. Our clients love the transparency and our team loves the efficiency. It's a game-changer for the industry.",
      author: "Emma Richardson",
      role: "Event Director",
      company: "Premier Events London"
    },
    techStack: ['React Native', 'Node.js', 'MongoDB', 'Stripe API', 'Google Maps API', 'Firebase', 'AWS Lambda', 'TypeScript'],
    timeline: '8 months',
    investment: '£52,000',
    roi: '285% in 18 months',
    status: 'live'
  },
  {
    id: 'journey-through-play',
    name: 'Journey Through Play',
    tagline: 'Interactive Learning Platform for Child Development',
    description: 'A comprehensive educational platform that combines play-based learning with developmental tracking. Features interactive games, progress monitoring, and personalized learning paths designed by child development experts.',
    category: 'Educational Technology & Child Development',
    image: 'https://firebasestorage.googleapis.com/v0/b/yourcaio-649fe.firebasestorage.app/o/jtpshot.png?alt=media&token=2858493a-8df2-4451-b493-834b2d17dcc5',
    features: [
      'Age-appropriate Interactive Learning Games',
      'Developmental Milestone Tracking & Assessment',
      'Personalized Learning Path Generation',
      'Parent & Educator Progress Dashboards',
      'Multi-sensory Learning Activities',
      'Social-emotional Learning Integration',
      'Accessibility Features for Special Needs',
      'Offline Mode & Cross-device Synchronization'
    ],
    challenges: [
      {
        title: 'Age-appropriate Content Delivery',
        description: 'Creating engaging content that adapts to different developmental stages and learning abilities across age groups.',
        solution: 'Developed adaptive content engine that adjusts complexity, interaction types, and pacing based on individual child development profiles.'
      },
      {
        title: 'Meaningful Progress Tracking',
        description: 'Measuring genuine learning progress beyond simple completion rates while respecting child privacy and development.',
        solution: 'Built comprehensive assessment system using play-based analytics that tracks skill development without intrusive testing.'
      },
      {
        title: 'Parent-Educator Collaboration',
        description: 'Bridging the gap between home and school learning while maintaining consistent developmental approaches.',
        solution: 'Created unified platform with role-based access, shared progress insights, and collaborative goal-setting tools.'
      }
    ],
    metrics: [
      { label: 'Learning Engagement', value: '+89%', icon: Star },
      { label: 'Skill Development', value: '+67%', icon: TrendingUp },
      { label: 'Parent Satisfaction', value: '4.8/5', icon: Users },
      { label: 'Usage Retention', value: '92%', icon: CheckCircle }
    ],
    testimonial: {
      quote: "Journey Through Play transformed how we approach early childhood education. Children are more engaged, parents are more involved, and we can actually see measurable developmental progress. It's revolutionized our teaching approach.",
      author: "Dr. Sarah Williams",
      role: "Head of Early Years",
      company: "Bright Minds Academy"
    },
    techStack: ['React Native', 'Unity', 'Node.js', 'PostgreSQL', 'AWS', 'WebRTC', 'TensorFlow Lite', 'Firebase'],
    timeline: '10 months',
    investment: '£68,000',
    roi: '340% in 2 years',
    status: 'live'
  },
  {
    id: 'jumpin-josephs',
    name: 'Jumpin Josephs',
    tagline: 'Complete Trampoline Park Management System',
    description: 'A comprehensive management platform for trampoline parks featuring online booking, waiver management, party planning, and operational analytics. Streamlines customer experience from booking to bounce with integrated safety protocols.',
    category: 'Recreation & Entertainment Management',
    image: 'https://firebasestorage.googleapis.com/v0/b/yourcaio-649fe.firebasestorage.app/o/jjs1.png?alt=media&token=2dfd8661-eefa-4e49-a0d3-3db8bb5f6e79',
    features: [
      'Online Booking & Session Management',
      'Digital Waiver & Safety Documentation',
      'Birthday Party & Event Planning Tools',
      'Real-time Capacity & Queue Management',
      'Integrated Payment Processing & POS',
      'Customer Loyalty & Membership Programs',
      'Staff Scheduling & Task Management',
      'Safety Incident Reporting & Analytics'
    ],
    challenges: [
      {
        title: 'Peak Time Management',
        description: 'Managing high-volume bookings during peak times while maintaining safety standards and customer satisfaction.',
        solution: 'Developed intelligent capacity management system with dynamic pricing, queue optimization, and automated safety monitoring.'
      },
      {
        title: 'Safety Compliance & Documentation',
        description: 'Ensuring all customers complete required waivers and safety briefings while maintaining smooth customer flow.',
        solution: 'Created streamlined digital waiver system with automated compliance checking and integrated safety video requirements.'
      },
      {
        title: 'Multi-revenue Stream Integration',
        description: 'Coordinating bookings, parties, memberships, and retail sales across different customer touchpoints.',
        solution: 'Built unified platform that integrates all revenue streams with cross-selling opportunities and comprehensive reporting.'
      }
    ],
    metrics: [
      { label: 'Booking Efficiency', value: '+85%', icon: Calendar },
      { label: 'Customer Throughput', value: '+45%', icon: Users },
      { label: 'Revenue Growth', value: '+67%', icon: TrendingUp },
      { label: 'Safety Compliance', value: '99.8%', icon: CheckCircle }
    ],
    testimonial: {
      quote: "Jumpin Josephs platform transformed our operations completely. We can handle twice as many customers with the same staff, our safety compliance is perfect, and parents love the seamless booking experience. It's been incredible for our business.",
      author: "Mike Thompson",
      role: "Operations Manager",
      company: "Bounce Zone Trampoline Park"
    },
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Twilio', 'AWS', 'Socket.io', 'Express.js'],
    timeline: '7 months',
    investment: '£45,000',
    roi: '380% in 18 months',
    status: 'live'
  },
  {
    id: 'spirit-pathways',
    name: 'Spirit Pathways',
    tagline: 'Holistic Wellness & Spiritual Growth Platform',
    description: 'A comprehensive wellness platform combining meditation, spiritual guidance, and personal development tools. Features guided sessions, progress tracking, community support, and personalized wellness journeys for holistic growth.',
    category: 'Wellness & Spiritual Development',
    image: 'https://firebasestorage.googleapis.com/v0/b/yourcaio-649fe.firebasestorage.app/o/spiritshot1.png?alt=media&token=fd287210-aeac-4380-91ec-e7555978ca02',
    features: [
      'Guided Meditation & Mindfulness Sessions',
      'Personalized Spiritual Journey Planning',
      'Progress Tracking & Wellness Analytics',
      'Community Support & Group Sessions',
      'Expert-led Workshops & Courses',
      'Daily Affirmations & Inspiration',
      'Mood & Energy Level Monitoring',
      'Integration with Wearable Devices'
    ],
    challenges: [
      {
        title: 'Personalized Spiritual Guidance',
        description: 'Creating meaningful, personalized spiritual experiences that resonate with diverse beliefs and practices.',
        solution: 'Developed adaptive content system that learns from user preferences and creates customized spiritual pathways.'
      },
      {
        title: 'Community Building & Engagement',
        description: 'Fostering genuine connections and supportive relationships in a digital wellness environment.',
        solution: 'Built sophisticated matching algorithms and facilitated group experiences based on spiritual interests and goals.'
      },
      {
        title: 'Measuring Spiritual Progress',
        description: 'Quantifying personal growth and spiritual development in meaningful, non-intrusive ways.',
        solution: 'Created holistic progress tracking using mood patterns, engagement metrics, and self-reflection tools.'
      }
    ],
    metrics: [
      { label: 'User Engagement', value: '87%', icon: Star },
      { label: 'Wellness Improvement', value: '+73%', icon: TrendingUp },
      { label: 'Community Growth', value: '+156%', icon: Users },
      { label: 'Session Completion', value: '91%', icon: CheckCircle }
    ],
    testimonial: {
      quote: "Spirit Pathways has been transformational for our wellness center. Our clients are more engaged, their progress is measurable, and the community aspect has created lasting connections. It's elevated our entire approach to holistic wellness.",
      author: "Dr. Maya Patel",
      role: "Wellness Director",
      company: "Harmony Wellness Center"
    },
    techStack: ['React Native', 'Node.js', 'MongoDB', 'WebRTC', 'AWS', 'Socket.io', 'Stripe', 'Firebase'],
    timeline: '9 months',
    investment: '£58,000',
    roi: '295% in 2 years',
    status: 'live'
  },
  {
    id: 'new-forest-activities',
    name: 'New Forest Activities',
    tagline: 'Outdoor Adventure Booking & Experience Platform',
    description: 'A comprehensive platform for discovering and booking outdoor activities in the New Forest. Features activity listings, real-time availability, weather integration, and guided experience management for nature enthusiasts.',
    category: 'Tourism & Outdoor Recreation',
    image: 'https://firebasestorage.googleapis.com/v0/b/yourcaio-649fe.firebasestorage.app/o/newforestshot1.png?alt=media&token=f578eefa-b394-404a-b19b-bd45a9fb20be',
    features: [
      'Activity Discovery & Advanced Filtering',
      'Real-time Availability & Weather Integration',
      'Guided Tour Booking & Management',
      'Interactive Maps & Trail Information',
      'Equipment Rental & Package Deals',
      'Group Booking & Corporate Events',
      'Safety Guidelines & Emergency Protocols',
      'Review System & Community Features'
    ],
    challenges: [
      {
        title: 'Weather-dependent Activity Management',
        description: 'Outdoor activities are heavily dependent on weather conditions, requiring dynamic scheduling and customer communication.',
        solution: 'Integrated real-time weather APIs with automated rebooking systems and proactive customer notifications for weather-related changes.'
      },
      {
        title: 'Seasonal Demand Fluctuations',
        description: 'Managing varying demand across seasons while maintaining profitability and customer satisfaction year-round.',
        solution: 'Developed dynamic pricing algorithms and seasonal activity recommendations to optimize bookings throughout the year.'
      },
      {
        title: 'Safety & Compliance Coordination',
        description: 'Ensuring all activities meet safety standards while coordinating with multiple outdoor activity providers.',
        solution: 'Built comprehensive safety management system with automated compliance checking and provider certification tracking.'
      }
    ],
    metrics: [
      { label: 'Booking Growth', value: '+145%', icon: TrendingUp },
      { label: 'Customer Satisfaction', value: '4.7/5', icon: Star },
      { label: 'Activity Utilization', value: '+82%', icon: Calendar },
      { label: 'Repeat Bookings', value: '68%', icon: Users }
    ],
    testimonial: {
      quote: "New Forest Activities platform has transformed how visitors experience our region. Bookings have increased dramatically, our activity providers are busier than ever, and visitors love the seamless experience. It's been fantastic for local tourism.",
      author: "James Mitchell",
      role: "Tourism Development Manager",
      company: "New Forest National Park Authority"
    },
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Google Maps API', 'Weather API', 'Stripe', 'AWS', 'Redis'],
    timeline: '6 months',
    investment: '£42,000',
    roi: '310% in 18 months',
    status: 'live'
  }
];

export function Showcase({ onBack }: ShowcaseProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'results'>('overview');

  const getStatusBadge = (status: Platform['status']) => {
    const styles = {
      live: 'bg-green-100 text-green-800 border-green-200',
      beta: 'bg-blue-100 text-blue-800 border-blue-200',
      development: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    const labels = {
      live: 'Live & Active',
      beta: 'Beta Testing',
      development: 'In Development'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (selectedPlatform) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedPlatform(null)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Showcase
              </button>
              {getStatusBadge(selectedPlatform.status)}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4 border border-blue-200">
                  {selectedPlatform.category}
                </div>
                <h1 className="text-3xl lg:text-4xl font-semibold mb-4 text-gray-800">
                  {selectedPlatform.name}
                </h1>
                <p className="text-lg text-blue-600 mb-6 font-medium">
                  {selectedPlatform.tagline}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {selectedPlatform.description}
                </p>
              </div>
              <div className="relative">
                <div className="bg-white rounded-lg p-6 border border-blue-100 shadow-sm">
                  <img 
                    src={selectedPlatform.image} 
                    alt={selectedPlatform.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedPlatform.metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-3 border border-blue-200">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {metric.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex space-x-6">
              {[
                { id: 'overview', label: 'Overview & Features' },
                { id: 'challenges', label: 'Challenges & Solutions' },
                { id: 'results', label: 'Results & Testimonials' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Features */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedPlatform.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Technology Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {selectedPlatform.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <Calendar className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                  <p className="text-gray-600">{selectedPlatform.timeline}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Investment</h3>
                  <p className="text-gray-600">{selectedPlatform.investment}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6">
                  <Award className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">ROI</h3>
                  <p className="text-gray-600">{selectedPlatform.roi}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Challenges & Solutions</h2>
              {selectedPlatform.challenges.map((challenge, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {challenge.title}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Challenge:</h4>
                          <p className="text-gray-600">{challenge.description}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Our Solution:</h4>
                          <p className="text-gray-600">{challenge.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-12">
                             {/* Testimonial */}
               <div className="bg-blue-50 rounded-lg p-6 lg:p-8 border border-blue-100">
                 <div className="max-w-4xl mx-auto text-center">
                   <div className="flex justify-center mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                     ))}
                   </div>
                   <blockquote className="text-lg text-gray-800 font-medium mb-6 leading-relaxed">
                     "{selectedPlatform.testimonial.quote}"
                   </blockquote>
                   <div className="flex items-center justify-center space-x-3">
                     <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                       <span className="text-white font-medium text-sm">
                         {selectedPlatform.testimonial.author.split(' ').map(n => n[0]).join('')}
                       </span>
                     </div>
                     <div className="text-left">
                       <div className="font-semibold text-gray-800 text-sm">
                         {selectedPlatform.testimonial.author}
                       </div>
                       <div className="text-gray-600 text-sm">
                         {selectedPlatform.testimonial.role}, {selectedPlatform.testimonial.company}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

              {/* Metrics Grid */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Measurable Results
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {selectedPlatform.metrics.map((metric, index) => {
                    const Icon = metric.icon;
                                         return (
                       <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                         <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4">
                           <Icon className="h-8 w-8 text-white" />
                         </div>
                         <div className="text-3xl font-bold text-gray-900 mb-2">
                           {metric.value}
                         </div>
                         <div className="text-gray-600">
                           {metric.label}
                         </div>
                       </div>
                     );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

                 {/* CTA Section */}
         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-blue-100">
           <div className="max-w-4xl mx-auto px-6 py-12 text-center">
             <h2 className="text-2xl lg:text-3xl font-semibold mb-4 text-gray-800">
               Ready to Transform Your Business?
             </h2>
             <p className="text-lg text-gray-600 mb-6 leading-relaxed">
               Let's discuss how we can build a custom AI solution that delivers similar results for your business. 
               Every project starts with understanding your unique challenges and opportunities.
             </p>
             <div className="flex flex-col sm:flex-row gap-3 justify-center">
               <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-sm">
                 <MessageSquare className="h-4 w-4" />
                 <span>Schedule Free Consultation</span>
               </button>
               <button className="border border-blue-300 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
                 <ExternalLink className="h-4 w-4" />
                 <span>View Live Demo</span>
               </button>
             </div>
             <p className="text-gray-500 text-sm mt-4">
               No commitment required • 30-minute strategy session • Custom solution roadmap
             </p>
           </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
             {/* Header */}
       <div className="bg-white border-b border-gray-100">
         <div className="max-w-7xl mx-auto px-6 py-8">
           <div className="flex items-center justify-between">
             <button
               onClick={onBack}
               className="flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
             >
               ← Back
             </button>
             <div className="text-center">
               <h1 className="text-2xl font-semibold text-gray-800">AI Platform Showcase</h1>
               <p className="text-gray-500 mt-1 text-sm">Real AI solutions delivering measurable business results</p>
             </div>
             <div></div>
           </div>
         </div>
       </div>

                    {/* Hero Section */}
       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
         <div className="max-w-7xl mx-auto px-6 py-16 text-center">
           <h2 className="text-3xl lg:text-4xl font-semibold mb-6 text-gray-800">
             Proven AI Solutions That Drive Results
           </h2>
           <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
             Explore our portfolio of custom AI platforms that have transformed businesses across industries. 
             Each solution addresses real challenges with measurable outcomes.
           </p>
           <div className="flex items-center justify-center space-x-8 text-gray-700">
             <div className="text-center bg-white rounded-lg p-4 shadow-sm border border-blue-100">
               <div className="text-xl font-semibold text-blue-600">6</div>
               <div className="text-xs text-gray-500">Custom Platforms</div>
             </div>
             <div className="text-center bg-white rounded-lg p-4 shadow-sm border border-blue-100">
               <div className="text-xl font-semibold text-blue-600">5</div>
               <div className="text-xs text-gray-500">Industries Served</div>
             </div>
             <div className="text-center bg-white rounded-lg p-4 shadow-sm border border-blue-100">
               <div className="text-xl font-semibold text-blue-600">100%</div>
               <div className="text-xs text-gray-500">Custom Built</div>
             </div>
             <div className="text-center bg-white rounded-lg p-4 shadow-sm border border-blue-100">
               <div className="text-xl font-semibold text-blue-600">2024</div>
               <div className="text-xs text-gray-500">Development Year</div>
             </div>
           </div>
         </div>
       </div>

      {/* Platforms Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-200 hover:-translate-y-1"
              onClick={() => setSelectedPlatform(platform)}
            >
              <div className="relative">
                <img 
                  src={platform.image} 
                  alt={platform.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4">
                  {getStatusBadge(platform.status)}
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
                    {platform.category}
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {platform.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-4 text-base">
                  {platform.tagline}
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {platform.description.substring(0, 140)}...
                </p>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {platform.metrics.slice(0, 2).map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg border border-blue-200">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="font-medium">{platform.timeline}</span>
                    <span>•</span>
                    <span className="font-medium text-green-600">{platform.roi}</span>
                  </div>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                    <span className="mr-2">View Details</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

             {/* CTA Section */}
       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-blue-100">
         <div className="max-w-4xl mx-auto px-6 py-16 text-center">
           <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-gray-800">
             Ready to Build Your Custom AI Solution?
           </h2>
           <p className="text-lg text-gray-600 mb-8 leading-relaxed">
             Every successful AI project starts with understanding your unique business challenges. 
             Let's explore how we can create a solution that delivers similar results for your organization.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-sm">
               <MessageSquare className="h-4 w-4" />
               <span>Discuss Your Project</span>
             </button>
             <button className="border border-blue-300 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
               <Play className="h-4 w-4" />
               <span>Watch Case Studies</span>
             </button>
           </div>
           <p className="text-gray-500 text-sm mt-6">
             Free consultation • No obligation • Custom solution roadmap included
           </p>
         </div>
       </div>
    </div>
  );
} 