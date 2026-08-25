export const mockCourses = [
  {
    id: '1',
    title: 'Advanced React Patterns & Performance',
    instructor: 'Sarah Kim',
    instructorRole: 'Staff Frontend Engineer @ Razorpay',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 3420,
    students: 12400,
    difficulty: 'Advanced',
    duration: '8 weeks',
    category: 'Frontend',
    level: 'Advanced',
    skills: ['React', 'Performance', 'Patterns', 'Custom Hooks', 'Redux Toolkit'],
    certificate: true,
    thumb: 'bg-[#E8F0FE]',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    price: 1,
    originalPrice: 4999,
    discount: '99% OFF (TEST MODE)',
    description: 'Master enterprise-grade React application architecture, custom hooks design, performance profiling, state optimization, and clean code principles.',
    whatYouWillLearn: [
      'Implement Advanced Compound Components & Render Props patterns',
      'Optimize React re-renders using useMemo, useCallback, and React.memo',
      'Master Concurrent Rendering, Suspense, and Server Components',
      'State management architecture with Redux Toolkit & Zustand',
      'Build reusable design systems and headless UI components'
    ],
    modules: [
      { id: 'm1', title: 'Module 1: Component Design Patterns', duration: '2h 15m', lessons: 8, topics: ['Compound Components', 'Control Props Pattern', 'Custom Hooks Extraction'] },
      { id: 'm2', title: 'Module 2: React Performance Profiling', duration: '3h 40m', lessons: 10, topics: ['React DevTools Profiler', 'Virtualization & Infinite Lists', 'Code Splitting & Lazy Loading'] },
      { id: 'm3', title: 'Module 3: Advanced State & Hydration', duration: '3h 10m', lessons: 9, topics: ['Zustand vs Redux', 'Server Side Rendering', 'State Synchronization'] },
      { id: 'm4', title: 'Module 4: Enterprise Capstone Project', duration: '4h 30m', lessons: 7, topics: ['Building a Real-time Dashboard', 'CI/CD & Automated Testing'] }
    ],
    reviews: [
      { name: 'Amit Verma', rating: 5, text: 'This course completely shifted how I write React code. The performance techniques saved 40% render time on my product!', date: '12 Feb 2026' },
      { name: 'Priya Sharma', rating: 5, text: 'Clear explanations and production-ready examples. Sarah Kim is an exceptional instructor!', date: '28 Jan 2026' }
    ],
    faqs: [
      { q: 'Is this course suitable for beginners?', a: 'This is an advanced course. You should have a solid foundation in JavaScript (ES6+) and basic React concepts.' },
      { q: 'Do I get lifetime access to course materials?', a: 'Yes, once purchased you have lifetime access to all lectures, code repositories, and future updates.' }
    ]
  },
  {
    id: '2',
    title: 'TypeScript Fundamentals to Advanced',
    instructor: 'Daniel Lee',
    instructorRole: 'Principal Engineer @ Stripe',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 2890,
    students: 9800,
    difficulty: 'Intermediate',
    duration: '6 weeks',
    category: 'Frontend',
    level: 'Intermediate',
    skills: ['TypeScript', 'Typing', 'Tooling', 'Generics', 'AST'],
    certificate: true,
    thumb: 'bg-[#FFF3E0]',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    price: 1299,
    originalPrice: 3999,
    discount: '67% OFF',
    description: 'Transition from JavaScript to TypeScript effortlessly. Learn generic constraints, conditional types, mapped types, and strict type safety.',
    whatYouWillLearn: [
      'Understand TypeScript type inference and strict type checking',
      'Master Generics, Union/Intersection types, and Mapped Types',
      'Integrate TypeScript with React, Express, and modern build tools',
      'Build end-to-end type-safe REST and GraphQL APIs'
    ],
    modules: [
      { id: 'm1', title: 'Module 1: Foundations of Type Safety', duration: '2h 00m', lessons: 6, topics: ['Primitive Types', 'Interfaces vs Type Aliases', 'Narrowing'] },
      { id: 'm2', title: 'Module 2: Generics & Utility Types', duration: '3h 00m', lessons: 9, topics: ['Generic Functions', 'Record, Partial, Pick, Omit', 'Infer Keyword'] },
      { id: 'm3', title: 'Module 3: React & Node with TypeScript', duration: '3h 30m', lessons: 8, topics: ['Typed Props & State', 'Express Route Typing', 'Prisma Integration'] }
    ],
    reviews: [
      { name: 'Rohan Gupta', rating: 5, text: 'Finally understood Generics and Conditional Types! Super high quality course.', date: '10 Feb 2026' }
    ],
    faqs: [
      { q: 'Will I receive a certificate?', a: 'Yes, upon completing all modules and assignments, you will receive a verified certificate.' }
    ]
  },
  {
    id: '3',
    title: 'Data Structures & Algorithms Intensive',
    instructor: 'Priya Sharma',
    instructorRole: 'Ex-Google SWE & Tech Educator',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 4510,
    students: 18200,
    difficulty: 'Intermediate',
    duration: '10 weeks',
    category: 'DSA',
    level: 'Intermediate',
    skills: ['DSA', 'Problem Solving', 'Graphs', 'Dynamic Programming'],
    certificate: true,
    thumb: 'bg-[#E8F5E9]',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    price: 2499,
    originalPrice: 7999,
    discount: '68% OFF',
    description: 'Master core DSA patterns needed to crack top tech interviews. Solve 150+ curated LeetCode questions step-by-step.',
    whatYouWillLearn: [
      'Master Two Pointers, Sliding Window, and Fast & Slow Pointers',
      'Tree Traversal, Binary Search Trees, Graphs (BFS, DFS, Dijkstra)',
      'Dynamic Programming patterns (1D, 2D, Knapsack, Subsequences)',
      'Time and Space Complexity Analysis (Big-O Notation)'
    ],
    modules: [
      { id: 'm1', title: 'Module 1: Arrays, Strings & Searching', duration: '4h 00m', lessons: 12, topics: ['Two Pointers', 'Binary Search', 'Sliding Window'] },
      { id: 'm2', title: 'Module 2: Trees & Graphs', duration: '5h 30m', lessons: 15, topics: ['BST Operations', 'Graph Traversal', 'Topological Sort'] },
      { id: 'm3', title: 'Module 3: Dynamic Programming', duration: '6h 00m', lessons: 18, topics: ['Memoization vs Tabulation', '0/1 Knapsack', 'LCS'] }
    ],
    reviews: [
      { name: 'Karan Patel', rating: 5, text: 'Cleared my Flipkart technical rounds because of this course! Priya maam explains DP so intuitively.', date: '04 Feb 2026' }
    ],
    faqs: [
      { q: 'What language is used for code examples?', a: 'Solutions are provided in JavaScript/Python and C++/Java.' }
    ]
  },
  {
    id: '4',
    title: 'System Design for Beginners',
    instructor: 'Marcus Chen',
    instructorRole: 'Senior Systems Architect @ AWS',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 1980,
    students: 7600,
    difficulty: 'Beginner',
    duration: '4 weeks',
    category: 'Backend',
    level: 'Beginner',
    skills: ['System Design', 'Scalability', 'Load Balancers', 'Caching'],
    certificate: true,
    thumb: 'bg-[#F3E5F5]',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    price: 1999,
    originalPrice: 5999,
    discount: '66% OFF',
    description: 'Learn how to architect large-scale distributed systems. Covers Load Balancers, Caching (Redis), Database Sharding, and Microservices.',
    whatYouWillLearn: [
      'Design scalable distributed systems from scratch',
      'Understand CAP Theorem, Consistency Models, and Replication',
      'Design TinyURL, Rate Limiter, WhatsApp, and Newsfeed systems',
      'Master caching strategies with Redis and CDN'
    ],
    modules: [
      { id: 'm1', title: 'Module 1: Building Blocks of Distributed Systems', duration: '3h 10m', lessons: 8, topics: ['Load Balancing', 'DNS & CDNs', 'SQL vs NoSQL'] },
      { id: 'm2', title: 'Module 2: Classic Interview System Design Questions', duration: '4h 20m', lessons: 10, topics: ['URL Shortener', 'Rate Limiter', 'Chat System'] }
    ],
    reviews: [
      { name: 'Siddharth Rao', rating: 5, text: 'Awesome introduction to System Design. Clear diagrams and real-world trade-off analysis.', date: '15 Jan 2026' }
    ],
    faqs: [
      { q: 'Is prior backend experience required?', a: 'Basic understanding of HTTP and databases is recommended.' }
    ]
  },
  {
    id: '5',
    title: 'SQL & Data Modeling Mastery',
    instructor: 'Ananya Gupta',
    instructorRole: 'Lead Data Engineer @ Swiggy',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 1420,
    students: 5400,
    difficulty: 'Intermediate',
    duration: '5 weeks',
    category: 'Data',
    level: 'Intermediate',
    skills: ['SQL', 'Modeling', 'Postgres', 'Window Functions'],
    certificate: true,
    thumb: 'bg-[#FFFDE7]',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    price: 1199,
    originalPrice: 3499,
    discount: '65% OFF',
    description: 'Master PostgreSQL, relational database design, indexing strategies, complex JOINs, CTEs, and Window Functions for data analytics.',
    whatYouWillLearn: [
      'Write advanced SQL queries with Window Functions & CTEs',
      'Normalize databases (1NF, 2NF, 3NF, BCNF)',
      'Optimize query execution plans and index strategy',
      'Data modeling for e-commerce and analytics pipelines'
    ],
    modules: [
      { id: 'm1', title: 'Module 1: Complex SQL Queries & Joins', duration: '2h 45m', lessons: 7, topics: ['Subqueries', 'CTEs', 'Window Functions'] },
      { id: 'm2', title: 'Module 2: Database Design & Indexing', duration: '3h 15m', lessons: 8, topics: ['B-Tree Indexing', 'EXPLAIN ANALYZE', 'Normalization'] }
    ],
    reviews: [
      { name: 'Neha Joshi', rating: 5, text: 'The window functions section alone was worth 10x the price!', date: '01 Feb 2026' }
    ],
    faqs: [
      { q: 'Which database software is used?', a: 'PostgreSQL 16.' }
    ]
  },
  {
    id: '6',
    title: 'UI/UX Engineering with Figma & Tailwind',
    instructor: 'Sofia Reyes',
    instructorRole: 'Product Designer @ Canva',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 1120,
    students: 4300,
    difficulty: 'Beginner',
    duration: '6 weeks',
    category: 'Design',
    level: 'Beginner',
    skills: ['Figma', 'Tailwind', 'A11y', 'Design Systems'],
    certificate: true,
    thumb: 'bg-[#E0F2F1]',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    price: 999,
    originalPrice: 2999,
    discount: '66% OFF',
    description: 'Bridge the gap between design and code. Create beautiful UI prototypes in Figma and translate them into responsive Tailwind CSS code.',
    whatYouWillLearn: [
      'Design modern, accessible UI in Figma using Auto-layout & Tokens',
      'Implement design systems cleanly with Tailwind CSS',
      'Create smooth animations and interactive micro-interactions',
      'Mobile-first responsive design best practices'
    ],
    modules: [
      { id: 'm1', title: 'Module 1: Figma Essentials for Developers', duration: '3h 00m', lessons: 8, topics: ['Auto Layout', 'Design Tokens', 'Components'] },
      { id: 'm2', title: 'Module 2: Tailwind CSS Implementation', duration: '3h 30m', lessons: 9, topics: ['Custom Config', 'Responsive Breakpoints', 'Glassmorphism'] }
    ],
    reviews: [
      { name: 'Deepak Nair', rating: 5, text: 'Super practical! Built my entire portfolio following Sofia’s methods.', date: '19 Jan 2026' }
    ],
    faqs: [
      { q: 'Do I need a paid Figma subscription?', a: 'No, the free tier of Figma is completely sufficient.' }
    ]
  },
  {
    id: '7',
    title: 'Node.js Backend & APIs',
    instructor: 'Arjun Patel',
    instructorRole: 'Staff Backend Engineer @ Postman',
    instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 2210,
    students: 8900,
    difficulty: 'Intermediate',
    duration: '7 weeks',
    category: 'Backend',
    level: 'Intermediate',
    skills: ['Node.js', 'REST', 'Auth', 'Express', 'JWT'],
    certificate: true,
    thumb: 'bg-[#FCE4EC]',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    price: 1799,
    originalPrice: 4999,
    discount: '64% OFF',
    description: 'Build production-ready RESTful APIs, JWT authentication, role-based access control, file upload handling, rate limiting, and security best practices.',
    whatYouWillLearn: [
      'Build Express.js server architectures with MVC pattern',
      'Implement JWT Auth, Refresh Tokens & OAuth 2.0',
      'File uploads with AWS S3 / Cloudinary',
      'Security headers (Helmet), Rate limiting, and Input Validation'
    ],
    modules: [
      { id: 'm1', title: 'Module 1: RESTful API Architecture', duration: '3h 15m', lessons: 8, topics: ['Routing', 'Middlewares', 'Error Handling'] },
      { id: 'm2', title: 'Module 2: Authentication & Authorization', duration: '4h 00m', lessons: 10, topics: ['JWT Secrets', 'Cookie Sessions', 'RBAC'] }
    ],
    reviews: [
      { name: 'Manish Kumar', rating: 5, text: 'Detailed, practical and up-to-date with modern Node.js standards.', date: '22 Jan 2026' }
    ],
    faqs: [
      { q: 'Does this cover MongoDB or SQL?', a: 'It covers MongoDB (Mongoose) and SQL integration.' }
    ]
  },
  {
    id: '8',
    title: 'Python for Data Science',
    instructor: 'Dr. Aisha Khan',
    instructorRole: 'Senior Data Scientist @ Microsoft',
    instructorAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 5200,
    students: 21000,
    difficulty: 'Beginner',
    duration: '8 weeks',
    category: 'Data',
    level: 'Beginner',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'ML Intro'],
    certificate: true,
    thumb: 'bg-[#FFF8E1]',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    price: 1999,
    originalPrice: 5999,
    discount: '66% OFF',
    description: 'Learn Python programming, NumPy, Pandas, Data Visualization, and introductory Machine Learning models step-by-step.',
    whatYouWillLearn: [
      'Master Python data structures and functional programming',
      'Data manipulation and cleaning with Pandas & NumPy',
      'Exploratory Data Analysis (EDA) and visualization with Seaborn',
      'Scikit-learn introduction to Linear Regression and Classification'
    ],
    modules: [
      { id: 'm1', title: 'Module 1: Python Fundamentals for Data', duration: '3h 00m', lessons: 7, topics: ['Lists, Dicts, Tuples', 'List Comprehensions', 'Functions'] },
      { id: 'm2', title: 'Module 2: Data Wrangling with Pandas', duration: '4h 30m', lessons: 11, topics: ['DataFrames', 'Groupby', 'Handling Missing Values'] }
    ],
    reviews: [
      { name: 'Vikram Singh', rating: 5, text: 'Dr. Aisha is brilliant! Explains complex math in super simple terms.', date: '05 Feb 2026' }
    ],
    faqs: [
      { q: 'Is Jupyter Notebook used in this course?', a: 'Yes, all exercises use Jupyter Notebooks / Google Colab.' }
    ]
  }
]
