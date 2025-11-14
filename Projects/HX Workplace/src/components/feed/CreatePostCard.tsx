import React, { useState } from 'react';
import { Image, FileText, Smile, Send } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import Avatar from '../common/Avatar';

const CreatePostCard: React.FC = () => {
  const { currentUser, addPost } = useAppContext();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim() && currentUser) {
      addPost({
        userId: currentUser.id,
        content: content.trim(),
      });
      
      setContent('');
      setIsExpanded(false);
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-card mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Avatar user={currentUser} size="md" />
          <div className="ml-3 flex-1">
            <button
              className="w-full text-left px-4 py-2 bg-neutral-100 rounded-full text-neutral-600 hover:bg-neutral-200 transition-colors"
              onClick={() => setIsExpanded(true)}
            >
              What's on your mind, {currentUser.name.split(' ')[0]}?
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full p-3 border border-neutral-300 rounded-lg focus:border-primary-400 focus:ring-1 focus:ring-primary-400 resize-none transition-colors"
              placeholder="Share an update, announcement, or idea..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            />
            
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                  title="Add photo"
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                  title="Add file"
                >
                  <FileText size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                  title="Add emoji"
                >
                  <Smile size={20} />
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
                  onClick={() => {
                    setContent('');
                    setIsExpanded(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send size={16} />
                  <span>Post</span>
                </button>
              </div>
            </div>
          </form>
        )}
        
        {!isExpanded && (
          <div className="flex border-t border-neutral-200 pt-3 mt-1">
            <button
              className="flex-1 flex items-center justify-center p-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
              onClick={() => setIsExpanded(true)}
            >
              <Image size={20} className="mr-2" />
              <span>Photo</span>
            </button>
            <button
              className="flex-1 flex items-center justify-center p-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
              onClick={() => setIsExpanded(true)}
            >
              <FileText size={20} className="mr-2" />
              <span>File</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostCard;