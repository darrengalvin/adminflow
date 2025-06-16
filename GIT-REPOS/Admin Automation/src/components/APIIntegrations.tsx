import React, { useState } from 'react';
import { Plus, RefreshCw, Settings, AlertTriangle, CheckCircle, Clock, ExternalLink, Shield, User, Search, Filter, Zap, Database, Mail, Calendar, CreditCard, FileText, Users, BarChart3, Globe, Smartphone, ShoppingCart, MessageSquare, Video, Music, Camera, Truck, Building, Briefcase, Heart, GraduationCap, Home, Utensils, Plane, Car, Gamepad2, Palette, Code, Wrench, Lock, Cloud, Server, Wifi, Headphones, Monitor, Printer, HardDrive, Cpu, Battery, Lightbulb, Thermometer, Watch, Glasses, Shirt, Gift, Star, Trophy, Target, Flag, Bookmark, Tag, Hash, AtSign, DollarSign, Percent, Euro, PoundSterling, Bitcoin, TrendingUp, PieChart, Activity, BarChart, LineChart, Layers, Box, Package, Archive, Folder, File, Image, Play, Pause, SkipForward, Volume2, Mic, Radio, Tv, Webcam, MapPin, Navigation, Compass, Map, Route, Bus, Train, Bike, Fuel, Anchor, Sailboat, Waves, Sun, Moon, CloudRain, Snowflake, Wind, Umbrella, Rainbow, Flower, TreePine, Leaf, Sprout, Bug, Bird, Fish, Cat, Dog, Rabbit, Turtle, Eye, EyeOff, Fingerprint, Scan, QrCode, Barcode, Banknote, Coins, Wallet, Receipt, Calculator, Scale, Ruler, Scissors, Paperclip, Pin, Pushpin, Magnet, Flashlight, Fire, Droplet, Droplets, Bolt, Plug, BatteryLow, Gauge, Timer, Stopwatch, AlarmClock, CalendarDays, CalendarCheck, CalendarX, CalendarPlus, CalendarMinus, CalendarClock, Send, Phone, Mountain, Grid } from 'lucide-react';

// Comprehensive integration data organized by categories
const integrationCategories = {
  'CRM & Sales': [
    { name: 'Salesforce', icon: 'Database', color: '#00A1E0', description: 'World\'s #1 CRM platform' },
    { name: 'HubSpot', icon: 'Users', color: '#FF7A59', description: 'Inbound marketing & sales' },
    { name: 'Pipedrive', icon: 'TrendingUp', color: '#1A73E8', description: 'Sales pipeline management' },
    { name: 'Zoho CRM', icon: 'BarChart3', color: '#C83E3E', description: 'Complete CRM solution' },
    { name: 'Microsoft Dynamics', icon: 'Building', color: '#0078D4', description: 'Enterprise CRM & ERP' },
    { name: 'GoHighLevel', icon: 'Zap', color: '#FF6B35', description: 'All-in-one marketing platform' },
    { name: 'ActiveCampaign', icon: 'Mail', color: '#356AE6', description: 'Email marketing automation' },
    { name: 'Keap', icon: 'Target', color: '#7B68EE', description: 'Small business CRM' },
    { name: 'Copper', icon: 'Briefcase', color: '#F4511E', description: 'Google Workspace CRM' },
    { name: 'Freshsales', icon: 'Users', color: '#2ECC71', description: 'Modern sales CRM' },
    { name: 'Close', icon: 'MessageSquare', color: '#1976D2', description: 'Inside sales CRM' },
    { name: 'Insightly', icon: 'Eye', color: '#FF6B35', description: 'CRM for small businesses' }
  ],
  'Email & Communication': [
    { name: 'Gmail', icon: 'Mail', color: '#EA4335', description: 'Google email service' },
    { name: 'Outlook', icon: 'Mail', color: '#0078D4', description: 'Microsoft email platform' },
    { name: 'Mailchimp', icon: 'Mail', color: '#FFE01B', description: 'Email marketing platform' },
    { name: 'SendGrid', icon: 'Send', color: '#1A82E2', description: 'Email delivery service' },
    { name: 'Constant Contact', icon: 'Mail', color: '#1976D2', description: 'Email marketing tools' },
    { name: 'Campaign Monitor', icon: 'BarChart', color: '#509E2F', description: 'Email marketing platform' },
    { name: 'ConvertKit', icon: 'Mail', color: '#FB6970', description: 'Creator email marketing' },
    { name: 'AWeber', icon: 'Mail', color: '#77B82F', description: 'Email marketing automation' },
    { name: 'GetResponse', icon: 'TrendingUp', color: '#00BAFF', description: 'Online marketing platform' },
    { name: 'Drip', icon: 'Droplet', color: '#EA4C89', description: 'E-commerce email marketing' },
    { name: 'Klaviyo', icon: 'Mail', color: '#000000', description: 'E-commerce email & SMS' },
    { name: 'Postmark', icon: 'Mail', color: '#FFCD00', description: 'Transactional email service' }
  ],
  'Calendar & Scheduling': [
    { name: 'Google Calendar', icon: 'Calendar', color: '#4285F4', description: 'Google calendar service' },
    { name: 'Outlook Calendar', icon: 'Calendar', color: '#0078D4', description: 'Microsoft calendar' },
    { name: 'Calendly', icon: 'CalendarCheck', color: '#006BFF', description: 'Scheduling automation' },
    { name: 'Acuity Scheduling', icon: 'Clock', color: '#6772E5', description: 'Online appointment scheduling' },
    { name: 'BookingBug', icon: 'Calendar', color: '#FF6B35', description: 'Appointment booking platform' },
    { name: 'SimplyBook.me', icon: 'CalendarDays', color: '#4CAF50', description: 'Online booking system' },
    { name: 'Setmore', icon: 'Calendar', color: '#4A90E2', description: 'Free appointment scheduling' },
    { name: 'Square Appointments', icon: 'CalendarCheck', color: '#3E4348', description: 'Appointment management' },
    { name: 'Appointlet', icon: 'Calendar', color: '#667EEA', description: 'Simple scheduling tool' },
    { name: 'YouCanBook.me', icon: 'CalendarPlus', color: '#FF6B6B', description: 'Online booking calendar' },
    { name: 'ScheduleOnce', icon: 'Clock', color: '#1976D2', description: 'Meeting scheduling platform' },
    { name: 'Doodle', icon: 'Calendar', color: '#FF6900', description: 'Meeting poll scheduler' }
  ],
  'Payment & Finance': [
    { name: 'Stripe', icon: 'CreditCard', color: '#635BFF', description: 'Online payment processing' },
    { name: 'PayPal', icon: 'CreditCard', color: '#003087', description: 'Digital payment platform' },
    { name: 'Square', icon: 'CreditCard', color: '#3E4348', description: 'Payment & POS solutions' },
    { name: 'QuickBooks', icon: 'Calculator', color: '#0077C5', description: 'Accounting software' },
    { name: 'Xero', icon: 'Calculator', color: '#13B5EA', description: 'Cloud accounting platform' },
    { name: 'FreshBooks', icon: 'Receipt', color: '#0E8F00', description: 'Invoicing & accounting' },
    { name: 'Wave', icon: 'Waves', color: '#1E88E5', description: 'Free accounting software' },
    { name: 'Sage', icon: 'Building', color: '#00A651', description: 'Business management software' },
    { name: 'Razorpay', icon: 'CreditCard', color: '#3395FF', description: 'Indian payment gateway' },
    { name: 'Braintree', icon: 'CreditCard', color: '#00D4AA', description: 'PayPal payment platform' },
    { name: 'Authorize.Net', icon: 'Shield', color: '#1976D2', description: 'Payment gateway service' },
    { name: 'Klarna', icon: 'CreditCard', color: '#FFB3C7', description: 'Buy now, pay later' }
  ],
  'Document & File Management': [
    { name: 'Google Drive', icon: 'HardDrive', color: '#4285F4', description: 'Cloud storage service' },
    { name: 'Dropbox', icon: 'Cloud', color: '#0061FF', description: 'File hosting service' },
    { name: 'OneDrive', icon: 'Cloud', color: '#0078D4', description: 'Microsoft cloud storage' },
    { name: 'Box', icon: 'Package', color: '#0061D5', description: 'Enterprise content management' },
    { name: 'PandaDoc', icon: 'FileText', color: '#00D4AA', description: 'Document automation platform' },
    { name: 'DocuSign', icon: 'FileText', color: '#FFB900', description: 'Electronic signature platform' },
    { name: 'Adobe Sign', icon: 'FileText', color: '#FF0000', description: 'Digital document solutions' },
    { name: 'HelloSign', icon: 'FileText', color: '#F26522', description: 'eSignature made simple' },
    { name: 'SignNow', icon: 'FileText', color: '#FF6B35', description: 'Electronic signature solution' },
    { name: 'Notion', icon: 'File', color: '#000000', description: 'All-in-one workspace' },
    { name: 'Airtable', icon: 'Database', color: '#18BFFF', description: 'Spreadsheet-database hybrid' },
    { name: 'Coda', icon: 'FileText', color: '#F46A25', description: 'Document database platform' }
  ],
  'Project Management': [
    { name: 'Asana', icon: 'Target', color: '#F06A6A', description: 'Team project management' },
    { name: 'Trello', icon: 'Layers', color: '#0079BF', description: 'Visual project boards' },
    { name: 'Monday.com', icon: 'Calendar', color: '#FF3D57', description: 'Work operating system' },
    { name: 'Jira', icon: 'Bug', color: '#0052CC', description: 'Issue & project tracking' },
    { name: 'ClickUp', icon: 'Target', color: '#7B68EE', description: 'All-in-one productivity' },
    { name: 'Basecamp', icon: 'Mountain', color: '#1F7A1F', description: 'Project management & collaboration' },
    { name: 'Wrike', icon: 'Briefcase', color: '#113A3C', description: 'Work management platform' },
    { name: 'Smartsheet', icon: 'Grid', color: '#E8B500', description: 'Enterprise work management' },
    { name: 'Teamwork', icon: 'Users', color: '#5A67D8', description: 'Project management software' },
    { name: 'Workfront', icon: 'Briefcase', color: '#E94B3C', description: 'Enterprise work management' },
    { name: 'Zoho Projects', icon: 'Target', color: '#C83E3E', description: 'Online project management' },
    { name: 'Microsoft Project', icon: 'Calendar', color: '#0078D4', description: 'Project management software' }
  ],
  'E-commerce & Retail': [
    { name: 'Shopify', icon: 'ShoppingCart', color: '#96BF48', description: 'E-commerce platform' },
    { name: 'WooCommerce', icon: 'ShoppingCart', color: '#96588A', description: 'WordPress e-commerce' },
    { name: 'Magento', icon: 'ShoppingCart', color: '#EE672F', description: 'Open-source e-commerce' },
    { name: 'BigCommerce', icon: 'ShoppingCart', color: '#121118', description: 'E-commerce software' },
    { name: 'Amazon', icon: 'Package', color: '#FF9900', description: 'Online marketplace' },
    { name: 'eBay', icon: 'ShoppingCart', color: '#E53238', description: 'Online auction platform' },
    { name: 'Etsy', icon: 'Heart', color: '#F16521', description: 'Handmade & vintage marketplace' },
    { name: 'PrestaShop', icon: 'ShoppingCart', color: '#DF0067', description: 'Open-source e-commerce' },
    { name: 'OpenCart', icon: 'ShoppingCart', color: '#1E91CF', description: 'Free e-commerce platform' },
    { name: 'Volusion', icon: 'ShoppingCart', color: '#2E5BBA', description: 'E-commerce website builder' },
    { name: '3dcart', icon: 'ShoppingCart', color: '#1976D2', description: 'E-commerce software' },
    { name: 'Ecwid', icon: 'ShoppingCart', color: '#FF6900', description: 'E-commerce widgets' }
  ],
  'Social Media & Marketing': [
    { name: 'Facebook', icon: 'Users', color: '#1877F2', description: 'Social networking platform' },
    { name: 'Instagram', icon: 'Camera', color: '#E4405F', description: 'Photo & video sharing' },
    { name: 'Twitter', icon: 'MessageSquare', color: '#1DA1F2', description: 'Microblogging platform' },
    { name: 'LinkedIn', icon: 'Users', color: '#0A66C2', description: 'Professional networking' },
    { name: 'YouTube', icon: 'Play', color: '#FF0000', description: 'Video sharing platform' },
    { name: 'TikTok', icon: 'Music', color: '#000000', description: 'Short-form video platform' },
    { name: 'Pinterest', icon: 'Image', color: '#BD081C', description: 'Visual discovery platform' },
    { name: 'Snapchat', icon: 'Camera', color: '#FFFC00', description: 'Multimedia messaging' },
    { name: 'Buffer', icon: 'Calendar', color: '#168EEA', description: 'Social media management' },
    { name: 'Hootsuite', icon: 'Users', color: '#1A1A1A', description: 'Social media dashboard' },
    { name: 'Sprout Social', icon: 'Sprout', color: '#59CB59', description: 'Social media management' },
    { name: 'Later', icon: 'Calendar', color: '#FF5A5F', description: 'Visual social media scheduler' }
  ],
  'Analytics & Reporting': [
    { name: 'Google Analytics', icon: 'BarChart3', color: '#F9AB00', description: 'Web analytics service' },
    { name: 'Mixpanel', icon: 'Activity', color: '#7856FF', description: 'Product analytics platform' },
    { name: 'Amplitude', icon: 'TrendingUp', color: '#1F77B4', description: 'Digital analytics platform' },
    { name: 'Hotjar', icon: 'Activity', color: '#FD3A69', description: 'Website heatmaps & recordings' },
    { name: 'Crazy Egg', icon: 'Activity', color: '#FF6900', description: 'Website optimization tools' },
    { name: 'Kissmetrics', icon: 'BarChart', color: '#8E44AD', description: 'Customer analytics platform' },
    { name: 'Adobe Analytics', icon: 'BarChart3', color: '#FF0000', description: 'Enterprise analytics' },
    { name: 'Segment', icon: 'PieChart', color: '#52BD95', description: 'Customer data platform' },
    { name: 'Heap', icon: 'Activity', color: '#8B5CF6', description: 'Digital insights platform' },
    { name: 'FullStory', icon: 'Play', color: '#1976D2', description: 'Digital experience analytics' },
    { name: 'LogRocket', icon: 'Monitor', color: '#764ABC', description: 'Frontend monitoring' },
    { name: 'Chartio', icon: 'LineChart', color: '#1976D2', description: 'Business intelligence platform' }
  ],
  'Communication & Chat': [
    { name: 'Slack', icon: 'MessageSquare', color: '#4A154B', description: 'Team communication platform' },
    { name: 'Microsoft Teams', icon: 'Users', color: '#6264A7', description: 'Collaboration platform' },
    { name: 'Discord', icon: 'MessageSquare', color: '#5865F2', description: 'Voice & text chat' },
    { name: 'Zoom', icon: 'Video', color: '#2D8CFF', description: 'Video conferencing platform' },
    { name: 'WhatsApp Business', icon: 'MessageSquare', color: '#25D366', description: 'Business messaging' },
    { name: 'Telegram', icon: 'Send', color: '#0088CC', description: 'Cloud-based messaging' },
    { name: 'Intercom', icon: 'MessageSquare', color: '#1F8DED', description: 'Customer messaging platform' },
    { name: 'Zendesk Chat', icon: 'MessageSquare', color: '#03363D', description: 'Live chat software' },
    { name: 'LiveChat', icon: 'MessageSquare', color: '#FF6900', description: 'Customer service platform' },
    { name: 'Drift', icon: 'MessageSquare', color: '#1976D2', description: 'Conversational marketing' },
    { name: 'Crisp', icon: 'MessageSquare', color: '#1972F5', description: 'Customer messaging platform' },
    { name: 'Freshchat', icon: 'MessageSquare', color: '#2ECC71', description: 'Modern messaging software' }
  ],
  'Development & IT': [
    { name: 'GitHub', icon: 'Code', color: '#181717', description: 'Code hosting platform' },
    { name: 'GitLab', icon: 'Code', color: '#FC6D26', description: 'DevOps platform' },
    { name: 'Bitbucket', icon: 'Code', color: '#0052CC', description: 'Git repository management' },
    { name: 'Jenkins', icon: 'Settings', color: '#D33833', description: 'Automation server' },
    { name: 'Docker', icon: 'Package', color: '#2496ED', description: 'Containerization platform' },
    { name: 'AWS', icon: 'Cloud', color: '#FF9900', description: 'Amazon Web Services' },
    { name: 'Google Cloud', icon: 'Cloud', color: '#4285F4', description: 'Google cloud platform' },
    { name: 'Microsoft Azure', icon: 'Cloud', color: '#0078D4', description: 'Microsoft cloud services' },
    { name: 'Heroku', icon: 'Cloud', color: '#430098', description: 'Cloud application platform' },
    { name: 'DigitalOcean', icon: 'Cloud', color: '#0080FF', description: 'Cloud infrastructure' },
    { name: 'Vercel', icon: 'Zap', color: '#000000', description: 'Frontend cloud platform' },
    { name: 'Netlify', icon: 'Globe', color: '#00C7B7', description: 'Web development platform' }
  ]
};

interface APIIntegrationsProps {
  integrations?: any[];
}

export function APIIntegrations({ integrations = [] }: APIIntegrationsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get icon component from Lucide
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      // Basic guaranteed icons only
      Database, Mail, Calendar, CreditCard, FileText, Users, BarChart3, Globe, 
      Smartphone, ShoppingCart, MessageSquare, Video, Music, Camera, Truck, 
      Building, Briefcase, Heart, Home, Plane, Car, Palette, Code, Wrench, 
      Lock, Cloud, Server, Wifi, Headphones, Monitor, Printer, HardDrive, 
      Cpu, Battery, Lightbulb, Watch, Gift, Star, Trophy, Target, Flag, 
      Bookmark, Tag, Hash, AtSign, DollarSign, Percent, TrendingUp, PieChart, 
      Activity, BarChart, LineChart, Layers, Box, Package, Archive, Folder, 
      File, Image, Play, Pause, Volume2, Mic, MapPin, Navigation, Compass, 
      Map, Bus, Train, Bike, Sun, Moon, Wind, Send, Phone, Grid, Plus, 
      RefreshCw, Settings, AlertTriangle, CheckCircle, Clock, ExternalLink, 
      Shield, User, Search, Filter, Zap
    };
    
    return iconMap[iconName] || Database;
  };

  // Filter integrations based on search and category
  const filteredCategories = Object.entries(integrationCategories).filter(([category, items]) => {
    if (selectedCategory !== 'all' && category !== selectedCategory) return false;
    
    if (searchTerm) {
      return items.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });

  const totalIntegrations = Object.values(integrationCategories).flat().length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Connect Everything with 101+ Integrations
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Transform your business with seamless connections to the world's leading platforms. 
            Our comprehensive integration ecosystem enables you to automate workflows, sync data, 
            and create powerful automations across all your favorite tools.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">One-Click Setup</h3>
              </div>
              <p className="text-sm text-gray-600">
                Connect any service in seconds with our secure OAuth authentication
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Enterprise Security</h3>
              </div>
              <p className="text-sm text-gray-600">
                Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Real-time Sync</h3>
              </div>
              <p className="text-sm text-gray-600">
                Keep your data synchronized across all platforms in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{totalIntegrations} integrations available</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Average setup time: 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>Trusted by 10,000+ businesses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {Object.keys(integrationCategories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Layers className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Integration Categories */}
      <div className="space-y-8">
        {filteredCategories.map(([category, items]) => {
          const filteredItems = searchTerm 
            ? items.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : items;

          if (filteredItems.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{category}</h2>
                  <span className="text-sm text-gray-500">{filteredItems.length} integrations</span>
                </div>
              </div>
              
              <div className="p-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredItems.map((integration, index) => {
                      const IconComponent = getIconComponent(integration.icon);
                      return (
                        <div
                          key={`${category}-${index}`}
                          className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${integration.color}15` }}
                            >
                              <IconComponent 
                                className="h-5 w-5" 
                                style={{ color: integration.color }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                                {integration.name}
                              </h3>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                            {integration.description}
                          </p>
                          <button className="w-full bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md text-sm font-medium transition-colors">
                            Connect
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredItems.map((integration, index) => {
                      const IconComponent = getIconComponent(integration.icon);
                      return (
                        <div
                          key={`${category}-${index}`}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${integration.color}15` }}
                            >
                              <IconComponent 
                                className="h-4 w-4" 
                                style={{ color: integration.color }}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                {integration.name}
                              </h3>
                              <p className="text-sm text-gray-500">{integration.description}</p>
                            </div>
                          </div>
                          <button className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 py-1 px-3 rounded-md text-sm font-medium transition-colors">
                            Connect
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Don't See Your Integration?</h2>
        <p className="text-blue-100 mb-6">
          We're constantly adding new integrations. Request yours and we'll prioritize it for development.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Request Integration
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
            View API Documentation
          </button>
        </div>
      </div>
    </div>
  );
}