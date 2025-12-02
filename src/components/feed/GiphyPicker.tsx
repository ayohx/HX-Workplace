import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

interface GiphyPickerProps {
  onSelect: (gif: { id: string; url: string; title: string }) => void;
  onClose: () => void;
}

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || '';

const GiphyPicker: React.FC<GiphyPickerProps> = ({ onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'search'>('trending');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load trending GIFs on mount
  useEffect(() => {
    loadTrendingGifs();
  }, []);

  // Search GIFs when query changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      setActiveTab('search');
      searchTimeoutRef.current = setTimeout(() => {
        searchGifs(searchQuery);
      }, 500); // Debounce search
    } else {
      setActiveTab('trending');
      loadTrendingGifs();
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const loadTrendingGifs = async () => {
    if (!GIPHY_API_KEY) {
      console.warn('GIPHY API key not configured');
      setGifs([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error('Failed to load trending GIFs:', error);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const searchGifs = async (query: string) => {
    if (!GIPHY_API_KEY) {
      console.warn('GIPHY API key not configured');
      setGifs([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          query
        )}&limit=20&rating=g`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error('Failed to search GIFs:', error);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGifSelect = (gif: any) => {
    onSelect({
      id: gif.id,
      url: gif.images.fixed_height.url,
      title: gif.title,
    });
  };

  // Show setup message if API key is missing
  if (!GIPHY_API_KEY) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">GIPHY Setup Required</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-neutral-600">
              To use GIF reactions, you need to add a GIPHY API key to your environment variables.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Quick Setup:</p>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Visit <a href="https://developers.giphy.com/" target="_blank" rel="noopener noreferrer" className="underline">developers.giphy.com</a></li>
                <li>Create a free app and copy your API key</li>
                <li>Add to <code className="bg-blue-100 px-1 rounded">.env.local</code>:</li>
              </ol>
              <pre className="mt-2 bg-blue-100 p-2 rounded text-xs">
VITE_GIPHY_API_KEY=your_key_here
              </pre>
              <p className="text-xs text-blue-700 mt-2">Then restart your dev server!</p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            Choose a GIF Reaction
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search for GIFs..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Tab indicator */}
        <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            {activeTab === 'trending' ? (
              <>
                <TrendingUp size={16} />
                <span>Trending GIFs</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>Search results for "{searchQuery}"</span>
              </>
            )}
          </div>
        </div>

        {/* GIF grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : gifs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all transform hover:scale-105"
                  onClick={() => handleGifSelect(gif)}
                >
                  <img
                    src={gif.images.fixed_height.url}
                    alt={gif.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
              <span className="text-4xl mb-2">🔍</span>
              <p>No GIFs found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-center gap-1 text-xs text-neutral-500">
            <span>Powered by</span>
            <a
              href="https://giphy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-primary-600"
            >
              GIPHY
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiphyPicker;
