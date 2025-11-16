import React from 'react';
import { Palmtree } from 'lucide-react';

interface CompanyLogoProps {
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-primary-500 p-1 rounded-md">
        <Palmtree className="h-6 w-6 text-white" />
      </div>
      <span className="ml-2 font-display font-bold text-primary-600 text-lg hidden sm:block">
        Holiday Extras
      </span>
    </div>
  );
};