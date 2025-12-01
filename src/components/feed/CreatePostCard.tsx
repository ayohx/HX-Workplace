import React, { useState } from 'react';
import { Image, FileText, Smile, Send } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import Avatar from '../common/Avatar';

const CreatePostCard: React.FC = () => {
  const { currentUser, addPost } = useAppContext();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addPost({
        userId: currentUser.id,
        content: content.trim(),
      });
      
      // Only clear form if post was created successfully
      setContent('');
      setIsExpanded(false);
    } catch (err: any) {
      console.error('Failed to create post:', err);
      setError(err.message || 'Failed to create post. Please try again.');
      // Don't clear form on error so user can retry
    } finally {
      setIsSubmitting(false);
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
            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <textarea
              className="w-full p-3 border border-neutral-300 rounded-lg focus:border-primary-400 focus:ring-1 focus:ring-primary-400 resize-none transition-colors"
              placeholder="Share an update, announcement, or idea..."
              rows={4}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError(null); // Clear error when user types
              }}
              disabled={isSubmitting}
              autoFocus
            />
            
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                  title="Add photo"
                  onClick={() => {
                    // TODO: Implement image upload (Story 1.4)
                    alert('Image upload will be implemented in Story 1.4 - File Attachments');
                  }}
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                  title="Add file"
                  onClick={() => {
                    // TODO: Implement file upload (Story 1.4)
                    alert('File upload will be implemented in Story 1.4 - File Attachments');
                  }}
                >
                  <FileText size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                  title="Add emoji"
                  onClick={() => {
                    // TODO: Implement emoji picker
                    alert('Emoji picker coming soon!');
                  }}
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
                    setError(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
        
        {!isExpanded && (
          <div className="flex border-t border-neutral-200 pt-3 mt-1">
            <button
              className="flex-1 flex items-center justify-center p-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
              onClick={() => {
                setIsExpanded(true);
                // TODO: Implement image upload (Story 1.4)
                setTimeout(() => alert('Image upload will be implemented in Story 1.4'), 100);
              }}
            >
              <Image size={20} className="mr-2" />
              <span>Photo</span>
            </button>
            <button
              className="flex-1 flex items-center justify-center p-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
              onClick={() => {
                setIsExpanded(true);
                // TODO: Implement file upload (Story 1.4)
                setTimeout(() => alert('File upload will be implemented in Story 1.4'), 100);
              }}
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