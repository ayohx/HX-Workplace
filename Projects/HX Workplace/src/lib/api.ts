import { mockUsers } from '../data/mockData';

export async function login(email: string, password: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = mockUsers.find(u => u.email === email);
  if (!user || user.password !== password) {
    throw new Error('Invalid login credentials');
  }

  // Remove password from returned user object
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
}

export async function register(userData: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    name: userData.name,
    email: userData.email,
    avatar: userData.avatar || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: userData.role || 'Member',
    department: userData.department || 'General',
  };

  return { user: newUser };
}

export async function logout() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
}

export async function updateProfile(userId: string, updates: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Update the user in mockUsers array
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  }

  return { success: true, updates };
}

export async function createPost(postData: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const post = {
    id: Math.random().toString(36).substr(2, 9),
    userId: postData.userId,
    content: postData.content,
    timestamp: new Date().toISOString(),
    likes: [],
    comments: [],
  };

  return { post };
}