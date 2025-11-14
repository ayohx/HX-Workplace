import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MoreHorizontal } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import Avatar from '../common/Avatar';

interface CommentListProps {
  comments: any[];
  users: any[];
}

const CommentList: React.FC<CommentListProps> = ({ comments, users }) => {
  const getUser = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  if (comments.length === 0) return null;

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const user = getUser(comment.userId);
        if (!user) return null;

        return (
          <div key={comment.id} className="flex group">
            <Avatar user={user} size="sm" className="mr-2 flex-shrink-0" />
            <div className="flex-1">
              <div className="bg-neutral-100 rounded-2xl px-3 py-2">
                <div className="flex justify-between">
                  <Link 
                    to={`/profile/${user.id}`} 
                    className="font-medium text-neutral-800 hover:underline"
                  >
                    {user.name}
                  </Link>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -mt-1 -mr-1 text-neutral-500 hover:text-neutral-700">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
                <p className="text-neutral-800 text-sm">{comment.content}</p>
              </div>
              <div className="flex items-center mt-1 ml-1 text-xs">
                <button className="text-neutral-500 hover:text-neutral-700 font-medium">
                  Like
                </button>
                <span className="mx-1 text-neutral-400">•</span>
                <button className="text-neutral-500 hover:text-neutral-700 font-medium">
                  Reply
                </button>
                <span className="mx-1 text-neutral-400">•</span>
                <span className="text-neutral-500">
                  {formatTimeAgo(new Date(comment.timestamp))}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;