import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import CreatePostCard from '../components/feed/CreatePostCard';
import PostCard from '../components/feed/PostCard';
import PostSkeleton from '../components/feed/PostSkeleton';
import { Clock, TrendingUp } from 'lucide-react';

type SortOption = 'recent' | 'relevant';

const Dashboard: React.FC = () => {
  const { posts, groups, loading, loadMorePosts, hasMorePosts, currentUser } = useAppContext();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  
  // Safety check: if no currentUser, something is wrong - show error message
  if (!currentUser) {
    console.error('Dashboard rendered without currentUser - this should not happen');
    return (
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">Error: User not authenticated. Please refresh the page.</p>
        </div>
      </div>
    );
  }
  
  // Sort posts based on selected option
  const sortedPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    
    const postsCopy = [...posts];
    
    if (sortBy === 'recent') {
      // Sort by timestamp (newest first)
      return postsCopy.sort((a, b) => 
        new Date(b.timestamp || b.created_at || 0).getTime() - 
        new Date(a.timestamp || a.created_at || 0).getTime()
      );
    } else {
      // Sort by relevance (engagement score: likes + comments + recency bonus)
      return postsCopy.sort((a, b) => {
        const aLikes = a.likes?.length || 0;
        const bLikes = b.likes?.length || 0;
        const aComments = a.comments?.length || 0;
        const bComments = b.comments?.length || 0;
        
        // Calculate engagement score (likes count more than comments)
        const aEngagement = (aLikes * 2) + aComments;
        const bEngagement = (bLikes * 2) + bComments;
        
        // Add recency bonus (posts from last 24h get a boost)
        const now = Date.now();
        const aTime = new Date(a.timestamp || a.created_at || 0).getTime();
        const bTime = new Date(b.timestamp || b.created_at || 0).getTime();
        const dayMs = 24 * 60 * 60 * 1000;
        
        const aRecencyBonus = (now - aTime) < dayMs ? 3 : 0;
        const bRecencyBonus = (now - bTime) < dayMs ? 3 : 0;
        
        const aScore = aEngagement + aRecencyBonus;
        const bScore = bEngagement + bRecencyBonus;
        
        // If scores are equal, sort by recency
        if (bScore === aScore) {
          return bTime - aTime;
        }
        
        return bScore - aScore;
      });
    }
  }, [posts, sortBy]);
  
  // Take 3 random groups for suggestions (memoized to prevent re-shuffle on every render)
  const suggestedGroups = useMemo(() => {
    if (!Array.isArray(groups) || groups.length === 0) return [];
    return [...groups].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [groups]);
  
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
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      {/* Header with title - hidden on mobile as it's in the nav */}
      <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-800 mb-4 sm:mb-6">Home</h1>
      
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)]">
        {/* Main content - scrollable feed area */}
        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden lg:pr-2">
          <CreatePostCard />
          
          {/* Feed Sort Controls */}
          <div className="flex items-center justify-between bg-white rounded-lg shadow-card p-3 mb-4">
            <span className="text-sm font-medium text-neutral-600">Sort by:</span>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setSortBy('recent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  sortBy === 'recent'
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Recent</span>
              </button>
              <button
                onClick={() => setSortBy('relevant')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  sortBy === 'relevant'
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Relevant</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4 pb-4">
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
              <div className="text-center py-6 sm:py-8 text-neutral-500">
                <p className="text-sm sm:text-base">You've reached the end of your feed</p>
              </div>
            )}
            
            {/* No posts message */}
            {!loading && posts.length === 0 && (
              <div className="bg-white rounded-lg shadow-card p-6 sm:p-8 text-center">
                <p className="text-neutral-600 mb-4 text-sm sm:text-base">No posts yet. Be the first to share something!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right sidebar - independent scroll */}
        <div className="hidden lg:flex lg:w-72 xl:w-80 lg:flex-col lg:flex-shrink-0 lg:overflow-y-auto lg:overflow-x-hidden">
          <div className="space-y-4 pb-4">
            {/* Suggested groups */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="p-3 border-b border-neutral-200">
                <h2 className="font-semibold text-neutral-800 text-sm">Suggested Groups</h2>
              </div>
              <div className="p-2">
                {suggestedGroups.map(group => (
                  <Link
                    key={group.id}
                    to={`/groups/${group.id}`}
                    className="flex items-start p-2 hover:bg-neutral-50 rounded-md transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-medium text-base flex-shrink-0">
                      {group.name.charAt(0)}
                    </div>
                    <div className="ml-2.5 min-w-0 flex-1">
                      <h3 className="font-medium text-neutral-800 text-sm truncate group-hover:text-primary-600 transition-colors">
                        {group.name}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {group.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-2.5 border-t border-neutral-200">
                <Link
                  to="/groups"
                  className="block w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-1"
                >
                  See all groups
                </Link>
              </div>
            </div>
          
            {/* Upcoming events placeholder */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="p-3 border-b border-neutral-200">
                <h2 className="font-semibold text-neutral-800 text-sm">Upcoming Events</h2>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-neutral-200 rounded-lg text-neutral-400">
                  <p className="text-xs">No upcoming events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;