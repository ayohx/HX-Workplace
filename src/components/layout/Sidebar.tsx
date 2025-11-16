import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  MessageSquare, 
  User, 
  FolderOpen, 
  Calendar, 
  HelpCircle, 
  Settings, 
  X
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { groups } = useAppContext();
  
  const mainLinks = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Users size={20} />, label: 'Groups', path: '/groups' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
    { icon: <FolderOpen size={20} />, label: 'Files', path: '/files' },
    { icon: <Calendar size={20} />, label: 'Events', path: '/events' },
  ];

  const bottomLinks = [
    { icon: <HelpCircle size={20} />, label: 'Help', path: '/help' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-neutral-200 flex flex-col">
      {/* Mobile close button */}
      {onClose && (
        <div className="p-4 md:hidden flex justify-end">
          <button 
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-full"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-neutral-600" />
          </button>
        </div>
      )}
      
      {/* Main navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {mainLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={onClose}
              >
                <span className="mr-3">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Groups section */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            My Groups
          </h3>
          <ul className="mt-2 space-y-1">
            {groups.slice(0, 5).map((group) => (
              <li key={group.id}>
                <Link
                  to={`/groups/${group.id}`}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive(`/groups/${group.id}`)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                  onClick={onClose}
                >
                  <span className="w-6 h-6 mr-3 flex items-center justify-center bg-primary-100 text-primary-600 rounded-md text-sm font-medium">
                    {group.name.charAt(0)}
                  </span>
                  <span className="font-medium truncate">{group.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/groups"
                className="flex items-center px-3 py-2 text-sm text-primary-600 hover:underline"
                onClick={onClose}
              >
                See all groups
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* Bottom links */}
      <div className="p-4 border-t border-neutral-200">
        <ul className="space-y-1">
          {bottomLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="flex items-center px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
                onClick={onClose}
              >
                <span className="mr-3">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;