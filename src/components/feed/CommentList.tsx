import React, { useState, useMemo } from 'react';
import Comment from './Comment';
import { MessageSquare } from 'lucide-react';

interface CommentListProps {
  comments: any[];
  postId: string;
  onReply?: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  sortOrder?: 'newest' | 'oldest';
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  postId,
  onReply,
  onEdit,
  onDelete,
  sortOrder = 'newest',
}) => {
  const [localSortOrder, setLocalSortOrder] = useState<'newest' | 'oldest'>(sortOrder);

  // Build comment tree structure
  const commentTree = useMemo(() => {
    if (!comments || comments.length === 0) return [];

    // Create a map of comments by ID
    const commentMap = new Map();
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Build the tree structure
    const rootComments: any[] = [];
    commentMap.forEach((comment) => {
      if (comment.parent_id) {
        // This is a reply
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(comment);
        } else {
          // Parent not found, treat as root comment
          rootComments.push(comment);
        }
      } else {
        // This is a root comment
        rootComments.push(comment);
      }
    });

    // Sort root comments
    rootComments.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return localSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Sort replies within each comment (always oldest first for replies)
    const sortReplies = (comment: any) => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort((a: any, b: any) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateA - dateB; // Oldest first for replies
        });
        comment.replies.forEach(sortReplies);
      }
    };
    rootComments.forEach(sortReplies);

    return rootComments;
  }, [comments, localSortOrder]);

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort controls */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
        <h3 className="font-semibold text-neutral-800">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Sort by:</span>
          <select
            className="text-sm border border-neutral-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={localSortOrder}
            onChange={(e) => setLocalSortOrder(e.target.value as 'newest' | 'oldest')}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Comment tree */}
      <div className="space-y-1">
        {commentTree.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={postId}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            depth={0}
            maxDepth={3}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList;