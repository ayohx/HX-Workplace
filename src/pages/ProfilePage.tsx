import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Mail, Phone, MapPin, Building2, Calendar, Link as LinkIcon, Edit2, X, Upload, Save, Camera, Users, ChevronDown, ChevronRight } from 'lucide-react';
import PostCard from '../components/feed/PostCard';

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const { currentUser, users, posts, updateProfile } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [showTeamHierarchy, setShowTeamHierarchy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    bio: '',
    location: '',
    phone: '',
    linkedin: '',
    avatar: null as File | null,
    coverImage: null as File | null,
    managerId: '',
  });
  
  // If no ID is provided, show current user's profile
  const profileUser = id ? users.find(u => u.id === id) : currentUser;
  const isOwnProfile = currentUser?.id === profileUser?.id;
  
  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-neutral-800">User not found</h2>
      </div>
    );
  }

  // Filter posts by this user
  const userPosts = posts.filter(post => post.userId === profileUser.id);

  // Get team hierarchy
  const getManager = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.managerId ? users.find(u => u.id === user.managerId) : null;
  };

  const getDirectReports = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.directReports ? users.filter(u => user.directReports?.includes(u.id)) : [];
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm(prev => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm(prev => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCover(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updateData = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        department: editForm.department,
        bio: editForm.bio,
        location: editForm.location,
        phone: editForm.phone,
        linkedin: editForm.linkedin,
        managerId: editForm.managerId || null,
        ...(previewImage && { avatar: previewImage }),
        ...(previewCover && { coverImage: previewCover }),
      };

      await updateProfile(currentUser.id, updateData);
      setIsEditing(false);
      setPreviewImage(null);
      setPreviewCover(null);
    }
  };

  const startEditing = () => {
    setEditForm({
      name: profileUser.name || '',
      email: profileUser.email || '',
      role: profileUser.role || '',
      department: profileUser.department || '',
      bio: profileUser.bio || '',
      location: profileUser.location || '',
      phone: profileUser.phone || '',
      linkedin: profileUser.linkedin || '',
      managerId: profileUser.managerId || '',
      avatar: null,
      coverImage: null,
    });
    setPreviewImage(null);
    setPreviewCover(null);
    setIsEditing(true);
  };

  const manager = getManager(profileUser.id);
  const directReports = getDirectReports(profileUser.id);

  return (
    <div className="max-w-5xl mx-auto pb-16 md:pb-0">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 rounded-lg mb-4 overflow-hidden group">
        <img
          src={previewCover || profileUser.coverImage || 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {isEditing && (
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="h-12 w-12 text-white" />
            <span className="ml-2 text-white font-medium">Change Cover Photo</span>
          </button>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>
      
      {/* Profile Header */}
      <div className="relative px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-6">
            <div className="relative group">
              <img
                src={previewImage || profileUser.avatar}
                alt={profileUser.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Upload className="h-8 w-8 text-white" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="mt-16 sm:mt-0 sm:ml-40 flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-bold text-neutral-800 bg-transparent border-b border-neutral-300 focus:border-primary-500 focus:outline-none"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                  className="text-neutral-600 bg-transparent border-b border-neutral-300 focus:border-primary-500 focus:outline-none"
                  placeholder="Job Title"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-neutral-800">{profileUser.name}</h1>
                <p className="text-neutral-600">{profileUser.role}</p>
              </>
            )}
          </div>
          
          {/* Action Buttons */}
          {isOwnProfile ? (
            <div className="mt-4 sm:mt-0">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors flex items-center"
                  >
                    <X size={18} className="mr-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={startEditing}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                >
                  <Edit2 size={18} className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                Message
              </button>
              <button className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors">
                Follow
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="mt-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="md:w-80">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-neutral-800">About</h2>
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="your.email@holidayextras.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your job title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Department
                    </label>
                    <select
                      value={editForm.department}
                      onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+44 20 1234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={editForm.linkedin}
                      onChange={(e) => setEditForm(prev => ({ ...prev, linkedin: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="linkedin.com/in/profile"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  {profileUser.bio && (
                    <p className="text-neutral-600 mb-4">{profileUser.bio}</p>
                  )}
                  <div className="flex items-center text-neutral-600">
                    <Building2 size={18} className="mr-3" />
                    <span>{profileUser.department || 'Holiday Extras'}</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <MapPin size={18} className="mr-3" />
                    <span>{profileUser.location || 'London, UK'}</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Mail size={18} className="mr-3" />
                    <span>{profileUser.email}</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Phone size={18} className="mr-3" />
                    <span>{profileUser.phone || '+44 20 1234 5678'}</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Calendar size={18} className="mr-3" />
                    <span>Joined January 2023</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <LinkIcon size={18} className="mr-3" />
                    {profileUser.linkedin ? (
                      <a href={profileUser.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        {profileUser.linkedin}
                      </a>
                    ) : (
                      <span className="text-neutral-400">No LinkedIn profile</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Teams Section */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-neutral-800">Team Hierarchy</h2>
                <button
                  onClick={() => setShowTeamHierarchy(!showTeamHierarchy)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  {showTeamHierarchy ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>
              
              {showTeamHierarchy && (
                <div className="space-y-4">
                  {/* Manager */}
                  {manager && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-600 mb-2">Reports to</h3>
                      <div className="flex items-center p-2 bg-neutral-50 rounded-md">
                        <img src={manager.avatar} alt={manager.name} className="w-8 h-8 rounded-full" />
                        <div className="ml-2">
                          <p className="text-sm font-medium text-neutral-800">{manager.name}</p>
                          <p className="text-xs text-neutral-500">{manager.role}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Direct Reports */}
                  {directReports.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-600 mb-2">Direct Reports</h3>
                      <div className="space-y-2">
                        {directReports.map(report => (
                          <div key={report.id} className="flex items-center p-2 bg-neutral-50 rounded-md">
                            <img src={report.avatar} alt={report.name} className="w-8 h-8 rounded-full" />
                            <div className="ml-2">
                              <p className="text-sm font-medium text-neutral-800">{report.name}</p>
                              <p className="text-xs text-neutral-500">{report.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Edit Manager (only when editing) */}
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Manager
                      </label>
                      <select
                        value={editForm.managerId}
                        onChange={(e) => setEditForm(prev => ({ ...prev, managerId: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">No manager</option>
                        {users.filter(u => u.id !== profileUser.id).map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} - {user.role}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                {profileUser.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">{profileUser.department}</span>
                    <span className="text-xs text-neutral-500">Member</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Feed */}
          <div className="flex-1">
            <div className="space-y-4">
              {userPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              
              {userPosts.length === 0 && (
                <div className="bg-white rounded-lg shadow-card p-8 text-center">
                  <p className="text-neutral-600">No posts yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;