import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatTimeAgo } from '../../utils/dateUtils';

interface NotificationsDropdownProps {
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const { notifications, users, markAllNotificationsAsRead } = useAppContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId) || null;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-600';
      case 'mention':
        return 'bg-green-100 text-green-600';
      case 'like':
        return 'bg-red-100 text-red-600';
      case 'comment':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-dropdown border border-neutral-200 overflow-hidden z-50 animate-fade-in"
    >
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-800">Notifications</h3>
          <button 
            onClick={markAllNotificationsAsRead}
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
          >
            <CheckCheck size={14} className="mr-1" />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 px-4 text-center text-neutral-500">
            <p>No notifications yet</p>
          </div>
        ) : (
          <ul>
            {notifications.map((notification) => {
              const user = getUserById(notification.userId);
              return (
                <li key={notification.id} className="border-b border-neutral-100 last:border-b-0">
                  <Link
                    to={notification.linkTo}
                    onClick={onClose}
                    className={`block p-4 hover:bg-neutral-50 transition-colors ${!notification.isRead ? 'bg-primary-50' : ''}`}
                  >
                    <div className="flex">
                      {user && (
                        <div className="flex-shrink-0 mr-3">
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-800">
                          {notification.content}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {formatTimeAgo(new Date(notification.timestamp))}
                        </p>
                      </div>
                      <div className={`flex-shrink-0 ml-2 w-2 h-2 rounded-full ${!notification.isRead ? 'bg-primary-500' : 'bg-transparent'}`} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      <div className="p-3 border-t border-neutral-200 bg-neutral-50">
        <Link
          to="/notifications"
          onClick={onClose}
          className="block w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationsDropdown;