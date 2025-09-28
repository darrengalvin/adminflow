import React, { useState } from 'react';
import { Bell, Settings, User, Search, Menu, X, Building2 } from 'lucide-react';
import { Notification } from '../types';

interface NavbarProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export function Navbar({ notifications, onNotificationClick }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav 
      className="sticky top-0 z-50 border-b"
      style={{ 
        background: 'var(--bg-navbar)', 
        borderColor: 'var(--border-primary)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--color-accent-primary)' }}
              >
                <Building2 className="h-5 w-5" style={{ color: 'var(--text-inverse)' }} />
              </div>
              <div className="hidden sm:block">
                <h1 className="heading-3" style={{ color: 'var(--text-primary)' }}>
                  AdminFlow
                </h1>
                <p className="small-text" style={{ color: 'var(--text-tertiary)' }}>
                  Business Automation Platform
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                style={{ color: 'var(--text-tertiary)' }}
              />
              <input
                type="text"
                placeholder="Search workflows, integrations, logs..."
                className="input-field w-full pl-10 pr-4"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: `1px solid var(--border-primary)`,
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-lg transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                style={{ color: 'var(--text-secondary)' }}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                    style={{ 
                      background: 'var(--color-accent-danger)', 
                      color: 'var(--text-inverse)' 
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div 
                  className="absolute right-0 mt-2 w-96 rounded-xl border"
                  style={{ 
                    background: 'var(--bg-elevated)', 
                    borderColor: 'var(--border-primary)',
                    boxShadow: 'var(--shadow-xl)'
                  }}
                >
                  <div className="p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-center justify-between">
                      <h3 className="heading-3">Notifications</h3>
                      {unreadCount > 0 && (
                        <span 
                          className="status-badge info text-xs px-2 py-1"
                        >
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => onNotificationClick(notification)}
                        className={`p-4 border-b cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50/30' : ''
                        }`}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'transparent' : 'var(--status-info-bg)'}
                        style={{ borderColor: 'var(--border-primary)' }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'error' ? 'bg-red-500' :
                            notification.type === 'warning' ? 'bg-amber-500' :
                            notification.type === 'success' ? 'bg-emerald-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="body-text font-medium" style={{ color: 'var(--text-primary)' }}>
                              {notification.title}
                            </p>
                            <p className="small-text mt-1" style={{ color: 'var(--text-secondary)' }}>
                              {notification.message}
                            </p>
                            <p className="small-text mt-1" style={{ color: 'var(--text-tertiary)' }}>
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-8 text-center">
                        <Bell className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                        <p className="body-text" style={{ color: 'var(--text-tertiary)' }}>
                          No notifications yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button 
              className="p-2.5 rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Profile */}
            <button 
              className="p-2.5 rounded-lg transition-all duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <User className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2.5 rounded-lg transition-all duration-200"
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              style={{ color: 'var(--text-secondary)' }}
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="px-3 py-2">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: 'var(--text-tertiary)' }}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="input-field w-full pl-10 pr-4"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: `1px solid var(--border-primary)`
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}