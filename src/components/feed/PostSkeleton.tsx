import React from 'react';

/**
 * Skeleton loader component for post cards
 * Displays while posts are loading to provide visual feedback
 */
const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center mb-4">
        {/* Avatar skeleton */}
        <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
        <div className="flex-1">
          {/* Name skeleton */}
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          {/* Role/timestamp skeleton */}
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Actions skeleton */}
      <div className="flex items-center space-x-6 pt-4 border-t">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;

