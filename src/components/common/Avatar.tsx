import React from 'react';

interface AvatarProps {
  user: {
    avatar?: string | null;
    name: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Default avatar fallback - uses initials on a coloured background
const getDefaultAvatar = (name: string): string => {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Generate a consistent colour based on name
  const colours = [
    'bg-primary-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-blue-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-red-600',
    'bg-indigo-600',
  ];
  const colourIndex = name.charCodeAt(0) % colours.length;
  
  // Return a data URL for a simple SVG avatar with initials
  const svg = `
    <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect width="150" height="150" fill="#6366f1" />
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };
  
  // Use avatar if available, otherwise use default with initials
  const avatarSrc = user.avatar || getDefaultAvatar(user.name);
  
  return (
    <div className={`flex-shrink-0 ${className}`}>
      <img 
        src={avatarSrc} 
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-neutral-200`}
        onError={(e) => {
          // Fallback to default if image fails to load
          const target = e.target as HTMLImageElement;
          if (target.src !== getDefaultAvatar(user.name)) {
            target.src = getDefaultAvatar(user.name);
          }
        }}
      />
    </div>
  );
};

export default Avatar;