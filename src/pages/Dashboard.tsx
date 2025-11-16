import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import CreatePostCard from '../components/feed/CreatePostCard';
import PostCard from '../components/feed/PostCard';
import PostSkeleton from '../components/feed/PostSkeleton';

const Dashboard: React.FC = () => {
  const { posts, groups, loading, loadMorePosts, hasMorePosts } = useAppContext();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  
  // Sort posts by timestamp (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Take 3 random groups for suggestions
  const suggestedGroups = [...groups]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  // Infinite scroll - load more posts when user scrolls to bottom
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMorePosts && !isLoadingMore && !loading) {
          setIsLoadingMore(true);
          loadMorePosts()
            .then(() => setIsLoadingMore(false))
            .catch((error) => {
              console.error('Failed to load more posts:', error);
              setIsLoadingMore(false);
            });
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }
    
    return () => {
      if (currentRef && observerRef.current) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [hasMorePosts, isLoadingMore, loading, loadMorePosts]);
  
  return (
    <div className="max-w-5xl mx-auto pb-16 md:pb-0">
      <h1 className="text-2xl font-display font-bold text-neutral-800 mb-6">Home</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
          <CreatePostCard />
          
          <div className="space-y-4">
            {/* Show skeletons while initial loading */}
            {loading && posts.length === 0 && (
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            )}
            
            {/* Show posts */}
            {sortedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            
            {/* Show "load more" skeletons */}
            {isLoadingMore && (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            )}
            
            {/* Infinite scroll trigger */}
            {hasMorePosts && !isLoadingMore && (
              <div ref={loadMoreRef} className="h-10" />
            )}
            
            {/* End of feed message */}
            {!loading && !hasMorePosts && posts.length > 0 && (
              <div className="text-center py-8 text-neutral-500">
                <p>You've reached the end of your feed</p>
              </div>
            )}
            
            {/* No posts message */}
            {!loading && posts.length === 0 && (
              <div className="bg-white rounded-lg shadow-card p-8 text-center">
                <p className="text-neutral-600 mb-4">No posts yet. Be the first to share something!</p>
              </div>
            )}
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