import React from 'react';

interface AvatarProps {
  user: {
    avatar: string;
    name: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };
  
  return (
    <div className={`flex-shrink-0 ${className}`}>
      <img 
        src={user.avatar} 
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-neutral-200`}
      />
    </div>
  );
};

export default Avatar;