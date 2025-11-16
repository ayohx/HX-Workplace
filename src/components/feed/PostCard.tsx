import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Edit2, Trash2, X } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatTimeAgo } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';
import CommentList from './CommentList';

interface PostCardProps {
  post: any;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { users, currentUser, toggleLike, addComment, editPost, removePost } = useAppContext();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use post.profiles if available (from database), otherwise fall back to users array
  const author = post.profiles || users.find(user => user.id === post.userId);
  const isLiked = post.likes.includes(currentUser?.id);
  const commentsCount = post.comments.length;
  const isOwner = currentUser?.id === post.userId;
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);
  
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
  
  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      await editPost(post.id, editContent);
      setShowEditModal(false);
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to edit post:', error);
      alert('Failed to edit post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeletePost = async () => {
    if (!currentUser) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;
    
    try {
      await removePost(post.id);
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
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
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button 
              className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
              aria-label="More options"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal size={18} />
            </button>
            
            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-neutral-100 flex items-center text-neutral-700"
                  onClick={() => {
                    setShowEditModal(true);
                    setShowMenu(false);
                    setEditContent(post.content);
                  }}
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit post
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-neutral-100 flex items-center text-red-600"
                  onClick={handleDeletePost}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Post content */}
      <div className="p-4">
        <p className="text-neutral-800 whitespace-pre-line">{post.content}</p>
        
        {/* Images from media_url (database format) */}
        {post.media_url && Array.isArray(post.media_url) && post.media_url.length > 0 && (
          <div className="mt-3 space-y-2">
            {post.media_url.map((url: string, index: number) => (
              <img 
                key={`media-${index}`}
                src={url} 
                alt={`Post image ${index + 1}`}
                className="rounded-lg max-h-96 w-auto"
                onError={(e) => {
                  // Hide broken images
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ))}
          </div>
        )}
        
        {/* Attachments (legacy mock data format) */}
        {post.attachments && Array.isArray(post.attachments) && post.attachments.length > 0 && (
          <div className="mt-3">
            {post.attachments.map((attachment: any) => (
              <div key={attachment.id || attachment.url} className="mt-2">
                {attachment.type === 'image' ? (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name || 'Post image'} 
                    className="rounded-lg max-h-96 w-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <a 
                    href={attachment.url} 
                    className="flex items-center p-2 border border-neutral-200 rounded-md hover:bg-neutral-50"
                  >
                    <div className="bg-primary-100 text-primary-600 p-2 rounded mr-2">
                      <span className="font-medium text-xs">{attachment.name?.split('.').pop()?.toUpperCase() || 'FILE'}</span>
                    </div>
                    <span className="text-sm text-neutral-700">{attachment.name || 'Attachment'}</span>
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
      
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-800">Edit Post</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditContent(post.content);
                }}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal body */}
            <form onSubmit={handleEditPost}>
              <div className="p-4">
                <textarea
                  className="w-full min-h-[150px] p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="What's on your mind?"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              
              {/* Modal footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditContent(post.content);
                  }}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!editContent.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
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