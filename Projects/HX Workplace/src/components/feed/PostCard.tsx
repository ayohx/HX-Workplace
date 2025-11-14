import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatTimeAgo } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';
import CommentList from './CommentList';

interface PostCardProps {
  post: any;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { users, currentUser, toggleLike, addComment } = useAppContext();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const author = users.find(user => user.id === post.userId);
  const isLiked = post.likes.includes(currentUser?.id);
  const commentsCount = post.comments.length;
  
  const handleToggleLike = () => {
    if (currentUser) {
      toggleLike(post.id, currentUser.id);
    }
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentUser) {
      addComment(post.id, {
        userId: currentUser.id,
        content: newComment,
      });
      setNewComment('');
    }
  };

  if (!author) return null;

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden mb-4 animate-fade-in">
      {/* Post header */}
      <div className="p-4 flex items-start justify-between border-b border-neutral-100">
        <div className="flex items-start">
          <Avatar user={author} size="md" />
          <div className="ml-3">
            <div className="flex items-center">
              <Link to={`/profile/${author.id}`} className="font-medium text-neutral-800 hover:underline">
                {author.name}
              </Link>
              <span className="mx-1 text-neutral-400">•</span>
              <span className="text-sm text-neutral-500">
                {formatTimeAgo(new Date(post.timestamp))}
              </span>
            </div>
            <p className="text-xs text-neutral-500">{author.role}</p>
          </div>
        </div>
        <button 
          className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      {/* Post content */}
      <div className="p-4">
        <p className="text-neutral-800 whitespace-pre-line">{post.content}</p>
        
        {/* Attachments (if any) */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-3">
            {post.attachments.map((attachment: any) => (
              <div key={attachment.id} className="mt-2">
                {attachment.type === 'image' ? (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name} 
                    className="rounded-lg max-h-96 w-auto"
                  />
                ) : (
                  <a 
                    href={attachment.url} 
                    className="flex items-center p-2 border border-neutral-200 rounded-md hover:bg-neutral-50"
                  >
                    <div className="bg-primary-100 text-primary-600 p-2 rounded mr-2">
                      <span className="font-medium text-xs">{attachment.name.split('.').pop().toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-neutral-700">{attachment.name}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Post stats */}
      <div className="px-4 py-2 border-t border-b border-neutral-100 flex justify-between text-sm text-neutral-500">
        <div>
          {post.likes.length > 0 && (
            <div className="flex items-center">
              <span className="flex items-center justify-center w-5 h-5 bg-primary-100 rounded-full mr-1">
                <ThumbsUp size={12} className="text-primary-600" />
              </span>
              <span>{post.likes.length}</span>
            </div>
          )}
        </div>
        <div>
          {commentsCount > 0 && (
            <button 
              className="hover:underline"
              onClick={() => setShowComments(!showComments)}
            >
              {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
            </button>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="px-4 py-2 flex justify-between border-b border-neutral-100">
        <button 
          className={`flex items-center px-4 py-2 rounded-md ${
            isLiked 
              ? 'text-primary-600' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
          onClick={handleToggleLike}
        >
          <ThumbsUp size={18} className="mr-2" />
          <span>Like</span>
        </button>
        
        <button 
          className="flex items-center px-4 py-2 rounded-md text-neutral-600 hover:bg-neutral-100"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare size={18} className="mr-2" />
          <span>Comment</span>
        </button>
        
        <button className="flex items-center px-4 py-2 rounded-md text-neutral-600 hover:bg-neutral-100">
          <Share2 size={18} className="mr-2" />
          <span>Share</span>
        </button>
      </div>
      
      {/* Comments section */}
      {(showComments || commentsCount > 0) && (
        <div className="p-4">
          {/* Comment list */}
          <CommentList comments={post.comments} users={users} />
          
          {/* Comment form */}
          <div className="mt-3 flex">
            {currentUser && (
              <Avatar user={currentUser} size="sm" className="mr-2 flex-shrink-0" />
            )}
            <form className="flex-1" onSubmit={handleSubmitComment}>
              <div className="flex rounded-full border border-neutral-300 bg-neutral-50 overflow-hidden">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 bg-transparent focus:outline-none"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim()}
                  className="px-4 text-primary-600 font-medium disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;