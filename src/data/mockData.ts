// Mock data for the application

// Users
export const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    password: 'password123', // Added password field
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverImage: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
    role: 'Product Manager',
    department: 'Product',
    bio: 'Passionate product manager with 8+ years of experience in building user-centric solutions.',
    location: 'London, UK',
    phone: '+44 20 1234 5678',
    linkedin: 'linkedin.com/in/johnsmith',
    managerId: null,
    directReports: ['2', '3'],
    settings: {
      notifications: {
        email: true,
        push: true,
        mentions: true,
        comments: true,
        likes: false
      },
      privacy: {
        profileVisibility: 'everyone',
        showEmail: true,
        showPhone: false,
        allowMessages: true
      },
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'Europe/London'
      }
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    password: 'password123', // Added password field
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverImage: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
    role: 'Frontend Developer',
    department: 'Engineering',
    bio: 'Frontend developer specializing in React and modern web technologies.',
    location: 'Manchester, UK',
    phone: '+44 161 234 5678',
    linkedin: 'linkedin.com/in/sarahjohnson',
    managerId: '1',
    directReports: [],
    settings: {
      notifications: {
        email: true,
        push: false,
        mentions: true,
        comments: true,
        likes: true
      },
      privacy: {
        profileVisibility: 'team',
        showEmail: false,
        showPhone: false,
        allowMessages: true
      },
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'Europe/London'
      }
    }
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    password: 'password123', // Added password field
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverImage: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
    role: 'UX Designer',
    department: 'Design',
    bio: 'UX designer focused on creating intuitive and accessible user experiences.',
    location: 'Birmingham, UK',
    phone: '+44 121 234 5678',
    linkedin: 'linkedin.com/in/michaelbrown',
    managerId: '1',
    directReports: [],
    settings: {
      notifications: {
        email: true,
        push: true,
        mentions: true,
        comments: false,
        likes: false
      },
      privacy: {
        profileVisibility: 'everyone',
        showEmail: true,
        showPhone: true,
        allowMessages: true
      },
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'Europe/London'
      }
    }
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    password: 'password123', // Added password field
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverImage: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
    role: 'Marketing Specialist',
    department: 'Marketing',
    bio: 'Marketing specialist with expertise in digital campaigns and brand strategy.',
    location: 'Leeds, UK',
    phone: '+44 113 234 5678',
    linkedin: 'linkedin.com/in/emilydavis',
    managerId: '5',
    directReports: [],
    settings: {
      notifications: {
        email: false,
        push: true,
        mentions: true,
        comments: true,
        likes: true
      },
      privacy: {
        profileVisibility: 'team',
        showEmail: false,
        showPhone: false,
        allowMessages: false
      },
      preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'Europe/London'
      }
    }
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    password: 'password123', // Added password field
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    coverImage: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
    role: 'Backend Developer',
    department: 'Engineering',
    bio: 'Backend developer with expertise in Node.js, Python, and cloud architecture.',
    location: 'Edinburgh, UK',
    phone: '+44 131 234 5678',
    linkedin: 'linkedin.com/in/davidwilson',
    managerId: null,
    directReports: ['4'],
    settings: {
      notifications: {
        email: true,
        push: true,
        mentions: true,
        comments: true,
        likes: false
      },
      privacy: {
        profileVisibility: 'everyone',
        showEmail: true,
        showPhone: true,
        allowMessages: true
      },
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'Europe/London'
      }
    }
  }
];

// Posts
export const mockPosts = [
  {
    id: '1',
    userId: '1',
    content: 'Excited to announce that our Q3 planning sessions will begin next week. Team leads, please prepare your roadmaps and be ready to share with the broader group.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: ['2', '3'],
    comments: [
      {
        id: 'c1',
        userId: '2',
        content: 'Looking forward to it! My team has some exciting initiatives to share.',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      }
    ]
  },
  {
    id: '2',
    userId: '3',
    content: 'Just finished the new design system documentation. You can find it in the Design team group. Feedback welcome!',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: ['1', '4', '5'],
    comments: [
      {
        id: 'c2',
        userId: '4',
        content: 'This looks fantastic! The marketing team will definitely benefit from this.',
        timestamp: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 'c3',
        userId: '5',
        content: 'Great work! This will help maintain consistency across all our platforms.',
        timestamp: new Date(Date.now() - 21600000).toISOString()
      }
    ],
    attachments: [
      {
        id: 'a1',
        type: 'file',
        name: 'DesignSystem_v2.pdf',
        url: '#'
      }
    ]
  },
  {
    id: '3',
    userId: '4',
    content: 'The new holiday booking campaign is live! Check out the stats from the first 24 hours - we\'re seeing a 35% increase in conversions compared to last year\'s campaign.',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    likes: ['1', '2'],
    comments: [],
    attachments: [
      {
        id: 'a2',
        type: 'image',
        name: 'Campaign_Stats.png',
        url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ]
  }
];

// Groups
export const mockGroups = [
  {
    id: '1',
    name: 'Engineering Team',
    description: 'A place for the engineering team to collaborate and share updates',
    members: ['2', '5'],
    posts: ['4', '5'],
    isPrivate: false
  },
  {
    id: '2',
    name: 'Design Team',
    description: 'Discussions about design, UX, and creative direction',
    members: ['3'],
    posts: ['6'],
    isPrivate: false
  },
  {
    id: '3',
    name: 'Marketing Team',
    description: 'Coordination for all marketing activities and campaigns',
    members: ['4'],
    posts: ['7'],
    isPrivate: false
  },
  {
    id: '4',
    name: 'Product Team',
    description: 'Product strategy, roadmap, and feature discussions',
    members: ['1'],
    posts: ['8'],
    isPrivate: false
  },
  {
    id: '5',
    name: 'Leadership',
    description: 'Private group for company leadership',
    members: ['1'],
    posts: ['9'],
    isPrivate: true
  }
];

// Messages
export const mockMessages = [
  {
    id: 'm1',
    senderId: '2',
    receiverId: '1',
    content: 'Hi John, do you have a moment to discuss the frontend requirements for the new booking feature?',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isRead: true
  },
  {
    id: 'm2',
    senderId: '1',
    receiverId: '2',
    content: 'Sure, Sarah. I\'m free around 2pm today. Does that work for you?',
    timestamp: new Date(Date.now() - 7000000).toISOString(),
    isRead: true
  },
  {
    id: 'm3',
    senderId: '2',
    receiverId: '1',
    content: 'Perfect! I\'ll send a calendar invite.',
    timestamp: new Date(Date.now() - 6800000).toISOString(),
    isRead: true
  },
  {
    id: 'm4',
    senderId: '3',
    receiverId: '1',
    content: 'John, I\'ve updated the mockups for the mobile app. Can you review them when you get a chance?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false
  }
];