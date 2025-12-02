import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, Sparkles } from 'lucide-react';
import Avatar from '../common/Avatar';
import GiphyPicker from './GiphyPicker';

interface User {
  id: string;
  name: string;
  avatar?: string | null;
}

interface CommentFormProps {
  currentUser: User | null;
  onSubmit: (content: string, giphyData?: { id: string; url: string }) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  currentUser,
  onSubmit,
  placeholder = 'Write a comment...',
  autoFocus = false,
}) => {
  const [content, setContent] = useState('');
  const [showGiphyPicker, setShowGiphyPicker] = useState(false);
  const [selectedGif, setSelectedGif] = useState<{ id: string; url: string; title: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim() || selectedGif) {
      onSubmit(
        content.trim(),
        selectedGif ? { id: selectedGif.id, url: selectedGif.url } : undefined
      );
      setContent('');
      setSelectedGif(null);
    }
  };

  const handleGifSelect = (gif: { id: string; url: string; title: string }) => {
    setSelectedGif(gif);
    setShowGiphyPicker(false);
  };

  const removeGif = () => {
    setSelectedGif(null);
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          {currentUser && (
            <Avatar user={currentUser} size="sm" className="flex-shrink-0" />
          )}
          
          <div className="flex-1">
            {/* GIF Preview */}
            {selectedGif && (
              <div className="mb-2 relative inline-block">
                <img
                  src={selectedGif.url}
                  alt={selectedGif.title}
                  className="max-h-32 rounded-lg border border-neutral-200"
                />
                <button
                  type="button"
                  onClick={removeGif}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}

            {/* Comment input */}
            <div className="flex rounded-lg border border-neutral-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 transition-all">
              <textarea
                ref={textareaRef}
                placeholder={placeholder}
                className="flex-1 px-4 py-2 bg-transparent focus:outline-none resize-none min-h-[40px] max-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                autoFocus={autoFocus}
                rows={1}
              />
              
              {/* Action buttons */}
              <div className="flex items-center gap-1 px-2 py-2">
                {/* GIPHY button */}
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 text-neutral-500 hover:text-purple-600 transition-all"
                  onClick={() => setShowGiphyPicker(true)}
                  title="Add GIF"
                >
                  <Sparkles size={18} />
                </button>

                {/* Emoji button (future) */}
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 transition-colors"
                  title="Add emoji (coming soon)"
                >
                  <Smile size={18} />
                </button>

                {/* Image button (future) */}
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 transition-colors"
                  title="Add image (coming soon)"
                >
                  <Image size={18} />
                </button>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!content.trim() && !selectedGif}
                  className="p-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Post comment"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Helper text */}
            <p className="text-xs text-neutral-500 mt-1 ml-1">
              Press Enter to post • Shift+Enter for new line
            </p>
          </div>
        </div>
      </form>

      {/* GIPHY Picker Modal */}
      {showGiphyPicker && (
        <GiphyPicker
          onSelect={handleGifSelect}
          onClose={() => setShowGiphyPicker(false)}
        />
      )}
    </div>
  );
};

export default CommentForm;
