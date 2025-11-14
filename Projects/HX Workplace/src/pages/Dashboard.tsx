import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import CreatePostCard from '../components/feed/CreatePostCard';
import PostCard from '../components/feed/PostCard';

const Dashboard: React.FC = () => {
  const { posts, groups } = useAppContext();
  
  // Sort posts by timestamp (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Take 3 random groups for suggestions
  const suggestedGroups = [...groups]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  return (
    <div className="max-w-5xl mx-auto pb-16 md:pb-0">
      <h1 className="text-2xl font-display font-bold text-neutral-800 mb-6">Home</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
          <CreatePostCard />
          
          <div className="space-y-4">
            {sortedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-80 space-y-6">
          {/* Suggested groups */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-800">Suggested Groups</h2>
            </div>
            <div className="p-2">
              {suggestedGroups.map(group => (
                <Link
                  key={group.id}
                  to={`/groups/${group.id}`}
                  className="flex items-center p-2 hover:bg-neutral-50 rounded-md transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-medium text-lg">
                    {group.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-neutral-800">{group.name}</h3>
                    <p className="text-xs text-neutral-500 truncate">{group.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="p-3 border-t border-neutral-200">
              <Link
                to="/groups"
                className="block w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                See all groups
              </Link>
            </div>
          </div>
          
          {/* Upcoming events placeholder */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-800">Upcoming Events</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-neutral-200 rounded-lg text-neutral-400">
                <p className="text-sm">No upcoming events</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;