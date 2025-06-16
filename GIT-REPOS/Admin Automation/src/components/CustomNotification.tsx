import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, Sparkles, Bot } from 'lucide-react';

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'info' | 'ai';
  title: string;
  message: string;
  details?: string;
  duration?: number;
  showCloseButton?: boolean;
}

interface CustomNotificationProps {
  notification: NotificationData;
  onClose: (id: string) => void;
}

export const CustomNotification: React.FC<CustomNotificationProps> = ({ 
  notification, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 50);

    // Auto-close after duration
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      case 'ai':
        return <Bot className="h-6 w-6 text-purple-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          accent: 'bg-emerald-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          accent: 'bg-red-500'
        };
      case 'ai':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          accent: 'bg-purple-500'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          accent: 'bg-blue-500'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full mx-4 transform transition-all duration-300 ease-out ${
        isVisible && !isExiting 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`${colors.bg} ${colors.border} border rounded-xl shadow-lg overflow-hidden`}>
        {/* Accent bar */}
        <div className={`${colors.accent} h-1 w-full`} />
        
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {notification.details && (
                    <div className="mt-3 p-3 bg-white/60 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-600 whitespace-pre-line">
                        {notification.details}
                      </p>
                    </div>
                  )}
                </div>
                
                {notification.showCloseButton !== false && (
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/50 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Manager Component
interface NotificationManagerProps {
  notifications: NotificationData[];
  onRemove: (id: string) => void;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  notifications,
  onRemove
}) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-3 pointer-events-none">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto"
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index 
          }}
        >
          <CustomNotification
            notification={notification}
            onClose={onRemove}
          />
        </div>
      ))}
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = (notification: Omit<NotificationData, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: NotificationData = {
      id,
      duration: 5000, // Default 5 seconds
      showCloseButton: true,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Helper methods for different notification types
  const showSuccess = (title: string, message: string, details?: string) => {
    return addNotification({ type: 'success', title, message, details });
  };

  const showError = (title: string, message: string, details?: string) => {
    return addNotification({ type: 'error', title, message, details });
  };

  const showInfo = (title: string, message: string, details?: string) => {
    return addNotification({ type: 'info', title, message, details });
  };

  const showAI = (title: string, message: string, details?: string) => {
    return addNotification({ type: 'ai', title, message, details });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showInfo,
    showAI
  };
}; 