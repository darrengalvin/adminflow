import React, { useState } from 'react';
import { useNotifications, NotificationManager } from './CustomNotification';

interface SupportPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onBack, onContinue }) => {
  const [selectedOption, setSelectedOption] = useState('');
  
  // Custom notifications
  const { notifications, removeNotification, showSuccess } = useNotifications();
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectDetails: '',
    timeline: '',
    referralName: '',
    referralEmail: '',
    referralCompany: ''
  });

  const handleSubmit = () => {
    if (selectedOption === 'skip') {
      onContinue();
      return;
    }

    // Here you would normally send the lead data to your backend
    console.log('Lead captured:', { selectedOption, leadFormData });
    
    // Show appropriate thank you message
    let thankYouMessage = '';
    if (selectedOption === 'lead') {
      thankYouMessage = '🎉 Awesome! Thanks for your interest. We\'ll reach out soon to chat about building custom automation tools that become valuable business assets. Enjoy the analysis!';
    } else if (selectedOption === 'referral') {
      thankYouMessage = '🤝 You\'re amazing! Thanks for spreading the word - it really helps us reach people who could benefit from custom automation development. Enjoy the analysis!';
    }
    
    if (thankYouMessage) {
      showSuccess(
        'Thank You!',
        thankYouMessage,
        'Enjoy your free AI analysis!'
      );
    }
    
    onContinue();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-gray-600 hover:text-gray-800">
          ← Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">🤔 What's the catch?</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">There is no catch!</h2>
          <p className="text-lg text-gray-700 mb-4">
            We built this analysis tool to help identify opportunities for custom automation development - not standard workflow tools.
          </p>
          <p className="text-gray-600">
            Of course we would <strong>LOVE</strong> your support to keep this free. Please choose one of the options below:
          </p>
        </div>

        {/* Support Options */}
        <div className="space-y-6 mb-8">
          {/* Option 1: Lead Generation */}
          <div className={`border rounded-xl p-6 transition-all cursor-pointer ${selectedOption === 'lead' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
            <label className="cursor-pointer">
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  name="supportOption"
                  value="lead"
                  checked={selectedOption === 'lead'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="mr-3"
                />
                <h3 className="font-bold text-gray-800">💼 I'd love to chat about custom automation development</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                I'm interested in building custom internal tools and automation systems that become valuable business assets. Let's have a conversation!
              </p>
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>What happens next:</strong> We'll reach out within 24 hours to schedule a friendly chat about building custom automation tools for your business.
                </p>
              </div>
            </label>

            {selectedOption === 'lead' && (
              <div className="mt-6 space-y-6 border-t pt-6">
                <div className="text-sm text-gray-600 font-medium mb-4">
                  Please fill out your details so we can get in touch:
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your name *</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={leadFormData.name}
                        onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email address *</label>
                      <input
                        type="email"
                        placeholder="your.email@company.com"
                        value={leadFormData.email}
                        onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company name</label>
                      <input
                        type="text"
                        placeholder="Your company name"
                        value={leadFormData.company}
                        onChange={(e) => setLeadFormData({...leadFormData, company: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                      <input
                        type="tel"
                        placeholder="Your phone number"
                        value={leadFormData.phone}
                        onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What processes would you like to turn into custom tools?</label>
                    <textarea
                      placeholder="Tell us about the repetitive tasks you'd love to turn into custom internal tools. Think beyond simple automation - what business assets could we build together?"
                      value={leadFormData.projectDetails}
                      onChange={(e) => setLeadFormData({...leadFormData, projectDetails: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">When would you like to get started?</label>
                    <select
                      value={leadFormData.timeline}
                      onChange={(e) => setLeadFormData({...leadFormData, timeline: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your preferred timeline</option>
                      <option value="immediately">Immediately</option>
                      <option value="1-3months">1-3 months</option>
                      <option value="3-6months">3-6 months</option>
                      <option value="6+months">6+ months</option>
                      <option value="exploring">Just exploring options</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Option 2: Referral */}
          <div className={`border rounded-xl p-6 transition-all cursor-pointer ${selectedOption === 'referral' ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
            <label className="cursor-pointer">
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  name="supportOption"
                  value="referral"
                  checked={selectedOption === 'referral'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="mr-3"
                />
                <h3 className="font-bold text-gray-800">🤝 I'll spread the word about this tool</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                I'll share this with colleagues or on social media - others could really benefit from this!
              </p>
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-xs text-green-800">
                  <strong>How it helps:</strong> Word of mouth is everything for small tools like this. Your referral could help someone save hours every week!
                </p>
              </div>
            </label>

            {selectedOption === 'referral' && (
              <div className="mt-6 space-y-6 border-t pt-6">
                <div className="text-sm text-gray-600 font-medium mb-4">
                  Choose how you'd like to help spread the word:
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Option 1: Refer a colleague</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Their name</label>
                          <input
                            type="text"
                            placeholder="Colleague's full name"
                            value={leadFormData.referralName}
                            onChange={(e) => setLeadFormData({...leadFormData, referralName: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Their email</label>
                          <input
                            type="email"
                            placeholder="colleague@company.com"
                            value={leadFormData.referralEmail}
                            onChange={(e) => setLeadFormData({...leadFormData, referralEmail: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Their company name</label>
                        <input
                          type="text"
                          placeholder="Their company name"
                          value={leadFormData.referralCompany}
                          onChange={(e) => setLeadFormData({...leadFormData, referralCompany: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Option 2: Share on social media</h4>
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Share this link:</strong>
                      </p>
                      <div className="text-sm font-mono bg-white p-4 rounded border text-blue-600 mb-3 break-all">
                        https://admin-automation.com/task-analysis
                      </div>
                      <p className="text-xs text-gray-500">
                        Perfect for LinkedIn, Twitter, or just sending to a colleague who's drowning in manual tasks!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Option 3: Skip */}
          <div className={`border rounded-xl p-6 transition-all cursor-pointer ${selectedOption === 'skip' ? 'border-gray-400 bg-gray-100 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
            <label className="cursor-pointer">
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  name="supportOption"
                  value="skip"
                  checked={selectedOption === 'skip'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="mr-3"
                />
                <h3 className="font-bold text-gray-600">⏭️ Just let me use the tool</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                No worries - I just want to analyse my tasks right now. Maybe I'll support you later!
              </p>
              <div className="bg-gray-200 p-3 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>That's totally fine!</strong> We hope the tool helps you discover some great automation opportunities.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-medium text-lg"
          >
            {selectedOption === 'skip' ? 'Continue to Analysis' : 'Thanks! Continue to Analysis'}
          </button>
          <button
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">🛠️ About This Tool</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Built by automation experts for real-world use</li>
            <li>• Analyses real API documentation and possibilities</li>
            <li>• Provides actionable reports for developers</li>
            <li>• Completely free during our beta period</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-3">💡 Why We Built This</h3>
          <p className="text-sm text-green-800">
            We were spending hours manually analysing client workflows for automation opportunities. 
            This tool does in minutes what used to take us hours - so we thought we'd share it with the world!
          </p>
        </div>
      </div>
      
      {/* Custom Notifications */}
      <NotificationManager 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default SupportPage; 