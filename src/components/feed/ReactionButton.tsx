import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, Heart, PartyPopper, Lightbulb, HelpCircle } from 'lucide-react';
import type { ReactionType } from '../../lib/api';

interface ReactionButtonProps {
  currentUserReaction: ReactionType | null;
  reactionCounts: Record<ReactionType, number>;
  onReactionToggle: (type: ReactionType) => void;
}

const reactionConfig: Record<ReactionType, { icon: React.ReactNode; label: string; emoji: string; color: string }> = {
  like: {
    icon: <ThumbsUp size={18} />,
    label: 'Like',
    emoji: '👍',
    color: 'text-blue-600',
  },
  love: {
    icon: <Heart size={18} />,
    label: 'Love',
    emoji: '❤️',
    color: 'text-red-600',
  },
  celebrate: {
    icon: <PartyPopper size={18} />,
    label: 'Celebrate',
    emoji: '🎉',
    color: 'text-yellow-600',
  },
  insightful: {
    icon: <Lightbulb size={18} />,
    label: 'Insightful',
    emoji: '💡',
    color: 'text-purple-600',
  },
  curious: {
    icon: <HelpCircle size={18} />,
    label: 'Curious',
    emoji: '🤔',
    color: 'text-green-600',
  },
};

const ReactionButton: React.FC<ReactionButtonProps> = ({
  currentUserReaction,
  reactionCounts,
  onReactionToggle,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  const handleReactionClick = (type: ReactionType) => {
    onReactionToggle(type);
    setShowPicker(false);
  };

  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  const currentReactionConfig = currentUserReaction ? reactionConfig[currentUserReaction] : null;

  return (
    <div className="relative" ref={pickerRef}>
      {/* Main reaction button */}
      <button
        className={`flex items-center px-4 py-2 rounded-md ${
          currentUserReaction
            ? `${currentReactionConfig?.color} font-medium`
            : 'text-neutral-600 hover:bg-neutral-100'
        }`}
        onClick={() => setShowPicker(!showPicker)}
        onMouseEnter={() => setShowPicker(true)}
      >
        {currentReactionConfig ? (
          <>
            <span className="mr-2">{currentReactionConfig.emoji}</span>
            <span>{currentReactionConfig.label}</span>
          </>
        ) : (
          <>
            <ThumbsUp size={18} className="mr-2" />
            <span>Like</span>
          </>
        )}
        {totalReactions > 0 && (
          <span className="ml-2 text-sm">({totalReactions})</span>
        )}
      </button>

      {/* Reaction picker - Emojis only */}
      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-neutral-200 p-2 flex gap-1 z-10 animate-fade-in">
          {(Object.keys(reactionConfig) as ReactionType[]).map((type) => {
            const config = reactionConfig[type];
            const count = reactionCounts[type];
            const isActive = currentUserReaction === type;

            return (
              <button
                key={type}
                className={`group relative flex flex-col items-center p-2 rounded-md hover:bg-neutral-100 transition-all ${
                  isActive ? 'bg-neutral-100' : ''
                }`}
                onClick={() => handleReactionClick(type)}
                title={config.label}
              >
                <span className="text-2xl transform group-hover:scale-125 transition-transform">
                  {config.emoji}
                </span>
                {count > 0 && (
                  <span className="text-xs text-neutral-500 mt-1">{count}</span>
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {config.label}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReactionButton;
