import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Edit2, Trash2, Reply, Heart } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';
import { useAppContext } from '../../contexts/AppContext';

interface CommentProps {
  comment: any;
  postId: string;
  onReply?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  depth?: number;
  maxDepth?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  postId,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
  maxDepth = 3,
}) => {
  const { currentUser } = useAppContext();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const author = comment.profiles || comment.author;
  const isOwner = currentUser?.id === comment.user_id;
  const canReply = depth < maxDepth;

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

  // Auto-focus and resize textarea when editing
  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
      setShowMenu(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      if (onDelete) {
        onDelete(comment.id);
      }
      setShowMenu(false);
    }
  };

  const handleReplySubmit = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className={`flex gap-3 ${depth > 0 ? 'ml-12 mt-3' : 'mt-4'} animate-fade-in`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar user={author} size={depth > 0 ? 'sm' : 'md'} />
      </div>

      {/* Comment content */}
      <div className="flex-1 min-w-0">
        {/* Comment header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/profile/${author?.id}`}
                className="font-semibold text-neutral-800 hover:underline text-sm"
              >
                {author?.name || 'Unknown User'}
              </Link>
              {author?.role && (
                <span className="text-xs text-neutral-500">{author.role}</span>
              )}
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs text-neutral-500">
                {formatTimeAgo(new Date(comment.created_at))}
              </span>
              {comment.is_edited && (
                <span className="text-xs text-neutral-400">(edited)</span>
              )}
            </div>
          </div>

          {/* Menu button */}
          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Comment options"
              >
                <MoreHorizontal size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10 animate-fade-in">
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-neutral-100 flex items-center text-sm text-neutral-700"
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                  >
                    <Edit2 size={14} className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-neutral-100 flex items-center text-sm text-red-600"
                    onClick={handleDelete}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment body */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              ref={editTextareaRef}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
              value={editContent}
              onChange={(e) => {
                setEditContent(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEdit();
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }
              }}
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
                onClick={handleEdit}
                disabled={!editContent.trim()}
              >
                Save
              </button>
              <button
                className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 rounded-md text-sm transition-colors"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-1">
            <p className="text-sm text-neutral-800 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>
        )}

        {/* Comment actions */}
        {!isEditing && (
          <div className="flex items-center gap-4 mt-2">
            <button
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                isLiked
                  ? 'text-red-600'
                  : 'text-neutral-500 hover:text-red-600'
              }`}
              onClick={handleLikeToggle}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {canReply && onReply && (
              <button
                className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-primary-600 transition-colors"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply size={14} />
                <span>Reply</span>
              </button>
            )}
          </div>
        )}

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-3 animate-fade-in">
            <div className="flex gap-2">
              {currentUser && (
                <Avatar user={currentUser} size="sm" className="flex-shrink-0" />
              )}
              <div className="flex-1">
                <textarea
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                  placeholder={`Reply to ${author?.name}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit();
                    } else if (e.key === 'Escape') {
                      setShowReplyForm(false);
                      setReplyContent('');
                    }
                  }}
                  rows={2}
                  autoFocus
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
                    onClick={handleReplySubmit}
                    disabled={!replyContent.trim()}
                  >
                    Reply
                  </button>
                  <button
                    className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 rounded-md text-sm transition-colors"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply: any) => (
              <Comment
                key={reply.id}
                comment={reply}
                postId={postId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
