import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Search, Phone, Video, MoreHorizontal } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import { formatTimeAgo } from '../utils/dateUtils';

const MessagesPage: React.FC = () => {
  const { currentUser, users, messages } = useAppContext();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter out the current user and search users
  const filteredUsers = users
    .filter(user => user.id !== currentUser?.id)
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Get messages for selected conversation
  const conversationMessages = messages.filter(message => 
    (message.senderId === selectedUserId && message.receiverId === currentUser?.id) ||
    (message.senderId === currentUser?.id && message.receiverId === selectedUserId)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Get the selected user
  const selectedUser = users.find(user => user.id === selectedUserId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedUserId) return;

    // In a real app, this would be handled by the backend
    console.log('Sending message:', {
      senderId: currentUser.id,
      receiverId: selectedUserId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    });

    setNewMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 md:pb-0">
      <div className="bg-white rounded-lg shadow-card overflow-hidden h-[calc(100vh-10rem)]">
        <div className="flex h-full">
          {/* Users list */}
          <div className="w-80 border-r border-neutral-200 flex flex-col">
            <div className="p-4 border-b border-neutral-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages"
                  className="w-full pl-10 pr-4 py-2 bg-neutral-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredUsers.map(user => {
                const lastMessage = messages
                  .filter(m => 
                    (m.senderId === user.id && m.receiverId === currentUser?.id) ||
                    (m.senderId === currentUser?.id && m.receiverId === user.id)
                  )
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

                return (
                  <button
                    key={user.id}
                    className={`w-full p-4 flex items-start hover:bg-neutral-50 transition-colors ${
                      selectedUserId === user.id ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <Avatar user={user} size="md" />
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-neutral-800 truncate">{user.name}</h3>
                        {lastMessage && (
                          <span className="text-xs text-neutral-500">
                            {formatTimeAgo(new Date(lastMessage.timestamp))}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 truncate">
                        {lastMessage?.content || user.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          {selectedUser ? (
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar user={selectedUser} size="md" />
                  <div className="ml-3">
                    <h2 className="font-medium text-neutral-800">{selectedUser.name}</h2>
                    <p className="text-sm text-neutral-500">{selectedUser.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                    <Video size={20} />
                  </button>
                  <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map(message => {
                  const isCurrentUser = message.senderId === currentUser?.id;
                  const sender = users.find(u => u.id === message.senderId);

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                        {!isCurrentUser && sender && (
                          <Avatar user={sender} size="sm" className="mb-1 mr-2" />
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isCurrentUser
                              ? 'bg-primary-500 text-white'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-100' : 'text-neutral-500'}`}>
                            {formatTimeAgo(new Date(message.timestamp))}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-neutral-200">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-neutral-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-2 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-neutral-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;