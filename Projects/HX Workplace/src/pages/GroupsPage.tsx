import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Users } from 'lucide-react';

const GroupsPage: React.FC = () => {
  const { groups, users } = useAppContext();

  const getGroupMembers = (memberIds: string[]) => {
    return users.filter(user => memberIds.includes(user.id));
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 md:pb-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-neutral-800">Groups</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center">
          <Users size={18} className="mr-2" />
          Create Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map(group => {
          const members = getGroupMembers(group.members);
          return (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-display font-semibold text-xl">
                    {group.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-neutral-800">{group.name}</h3>
                    <p className="text-sm text-neutral-500">{group.isPrivate ? 'Private group' : 'Public group'}</p>
                  </div>
                </div>
                
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {group.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {members.slice(0, 3).map(member => (
                      <img
                        key={member.id}
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full border-2 border-white"
                      />
                    ))}
                    {group.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-neutral-600 font-medium">
                          +{group.members.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-neutral-500">
                    {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GroupsPage;