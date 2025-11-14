import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/feed/PostCard';
import CreatePostCard from '../components/feed/CreatePostCard';
import { Users, Settings } from 'lucide-react';

const GroupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { groups, posts, users } = useAppContext();
  
  const group = groups.find(g => g.id === id);
  const groupMembers = users.filter(user => group?.members.includes(user.id));
  const groupPosts = posts.filter(post => group?.posts.includes(post.id));

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-neutral-800">Group not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 md:pb-0">
      <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-display font-semibold text-2xl">
                {group.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-display font-bold text-neutral-800">{group.name}</h1>
                <p className="text-neutral-500">{group.isPrivate ? 'Private group' : 'Public group'} • {group.members.length} members</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center">
                <Users size={18} className="mr-2" />
                Invite
              </button>
              <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
          
          <p className="text-neutral-600">{group.description}</p>
          
          <div className="mt-4 flex -space-x-2">
            {groupMembers.slice(0, 5).map(member => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full border-2 border-white"
                title={member.name}
              />
            ))}
            {groupMembers.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-neutral-600 font-medium">
                  +{groupMembers.length - 5}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <CreatePostCard />
          
          <div className="space-y-4">
            {groupPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {groupPosts.length === 0 && (
              <div className="bg-white rounded-lg shadow-card p-8 text-center">
                <p className="text-neutral-600">No posts in this group yet.</p>
                <p className="text-neutral-500 text-sm mt-1">Be the first to share something!</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-80">
          <div className="bg-white rounded-lg shadow-card overflow-hidden sticky top-20">
            <div className="p-4 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-800">Members</h2>
            </div>
            <div className="p-2">
              {groupMembers.map(member => (
                <div key={member.id} className="flex items-center p-2 hover:bg-neutral-50 rounded-md">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-800">{member.name}</p>
                    <p className="text-xs text-neutral-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;