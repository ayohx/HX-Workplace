import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Search as SearchIcon, Users, FileText, MessageSquare } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import { formatTimeAgo } from '../utils/dateUtils';

type SearchCategory = 'all' | 'people' | 'posts' | 'groups';

const SearchPage: React.FC = () => {
  const { users, posts, groups } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [searchResults, setSearchResults] = useState({
    people: [] as typeof users,
    posts: [] as typeof posts,
    groups: [] as typeof groups,
  });

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({ people: [], posts: [], groups: [] });
      return;
    }

    const term = searchTerm.toLowerCase();

    const filteredPeople = users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.department.toLowerCase().includes(term)
    );

    const filteredPosts = posts.filter(post =>
      post.content.toLowerCase().includes(term)
    );

    const filteredGroups = groups.filter(group =>
      group.name.toLowerCase().includes(term) ||
      group.description.toLowerCase().includes(term)
    );

    setSearchResults({
      people: filteredPeople,
      posts: filteredPosts,
      groups: filteredGroups,
    });
  }, [searchTerm, users, posts, groups]);

  const categories = [
    { id: 'all', label: 'All', icon: SearchIcon },
    { id: 'people', label: 'People', icon: Users },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'groups', label: 'Groups', icon: MessageSquare },
  ] as const;

  const shouldShowCategory = (category: SearchCategory) => {
    if (category === 'all') return true;
    return searchResults[category].length > 0;
  };

  const renderResults = () => {
    if (!searchTerm.trim()) {
      return (
        <div className="text-center py-12">
          <SearchIcon className="mx-auto h-12 w-12 text-neutral-300" />
          <p className="mt-4 text-neutral-600">Enter a search term to find people, posts, and groups</p>
        </div>
      );
    }

    if (activeCategory === 'all' && 
        !searchResults.people.length && 
        !searchResults.posts.length && 
        !searchResults.groups.length) {
      return (
        <div className="text-center py-12">
          <p className="text-neutral-600">No results found for "{searchTerm}"</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* People Results */}
        {(activeCategory === 'all' || activeCategory === 'people') && searchResults.people.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">People</h2>
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              {searchResults.people.map(person => (
                <Link
                  key={person.id}
                  to={`/profile/${person.id}`}
                  className="flex items-center p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0"
                >
                  <Avatar user={person} size="md" />
                  <div className="ml-3">
                    <h3 className="font-medium text-neutral-800">{person.name}</h3>
                    <p className="text-sm text-neutral-500">{person.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Groups Results */}
        {(activeCategory === 'all' || activeCategory === 'groups') && searchResults.groups.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">Groups</h2>
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              {searchResults.groups.map(group => (
                <Link
                  key={group.id}
                  to={`/groups/${group.id}`}
                  className="flex items-center p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0"
                >
                  <div className="w-10 h-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-medium text-lg">
                    {group.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-neutral-800">{group.name}</h3>
                    <p className="text-sm text-neutral-500 truncate">{group.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Posts Results */}
        {(activeCategory === 'all' || activeCategory === 'posts') && searchResults.posts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">Posts</h2>
            <div className="space-y-4">
              {searchResults.posts.map(post => {
                const author = users.find(user => user.id === post.userId);
                if (!author) return null;

                return (
                  <div key={post.id} className="bg-white rounded-lg shadow-card p-4">
                    <div className="flex items-center mb-3">
                      <Avatar user={author} size="sm" />
                      <div className="ml-3">
                        <Link to={`/profile/${author.id}`} className="font-medium text-neutral-800 hover:underline">
                          {author.name}
                        </Link>
                        <p className="text-xs text-neutral-500">{formatTimeAgo(new Date(post.timestamp))}</p>
                      </div>
                    </div>
                    <p className="text-neutral-800">{post.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 md:pb-0">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search people, posts, and groups..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-lg shadow-sm focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
        </div>
      </div>

      {searchTerm && (
        <div className="mb-6 flex space-x-2">
          {categories.map(({ id, label, icon: Icon }) => (
            shouldShowCategory(id) && (
              <button
                key={id}
                className={`px-4 py-2 rounded-full flex items-center ${
                  activeCategory === id
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setActiveCategory(id)}
              >
                <Icon size={18} className="mr-2" />
                <span>{label}</span>
                {id !== 'all' && searchResults[id].length > 0 && (
                  <span className="ml-2 text-sm">({searchResults[id].length})</span>
                )}
              </button>
            )
          ))}
        </div>
      )}

      {renderResults()}
    </div>
  );
};

export default SearchPage;