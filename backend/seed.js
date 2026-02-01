require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./src/models/Course');
const User = require('./src/models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Sample courses data
    const coursesData = [
      {
        title: 'JavaScript Fundamentals',
        slug: 'javascript-fundamentals',
        description: 'Learn the basics of JavaScript programming. This comprehensive course covers variables, functions, objects, and modern ES6+ features.',
        price: 49.99,
        category: 'programming',
        difficulty: 'beginner',
        instructor: 'John Smith',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=JavaScript+Fundamentals',
        lessons: [
          {
            title: 'Introduction to JavaScript',
            contentHtml: '<h2>Getting Started</h2><p>JavaScript is a versatile programming language primarily used for web development. In this lesson, you will learn about the history and modern uses of JavaScript.</p>',
            videoUrl: 'https://example.com/videos/lesson1.mp4',
            order: 1,
          },
          {
            title: 'Variables and Data Types',
            contentHtml: '<h2>Understanding Variables</h2><p>Learn about var, let, const and different data types in JavaScript including strings, numbers, booleans, and more.</p>',
            videoUrl: 'https://example.com/videos/lesson2.mp4',
            order: 2,
          },
          {
            title: 'Functions and Scope',
            contentHtml: '<h2>Working with Functions</h2><p>Discover how to write reusable functions and understand JavaScript scope.</p>',
            videoUrl: 'https://example.com/videos/lesson3.mp4',
            order: 3,
          },
        ],
      },
      {
        title: 'React.js Mastery',
        slug: 'react-mastery',
        description: 'Master React.js and build modern, interactive web applications. Learn about components, hooks, state management, and more.',
        price: 79.99,
        category: 'programming',
        difficulty: 'intermediate',
        instructor: 'Sarah Johnson',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=React+Mastery',
        lessons: [
          {
            title: 'React Basics',
            contentHtml: '<h2>Introduction to React</h2><p>Learn the fundamentals of React including JSX, components, and the virtual DOM.</p>',
            videoUrl: 'https://example.com/videos/react1.mp4',
            order: 1,
          },
          {
            title: 'Hooks and State Management',
            contentHtml: '<h2>React Hooks</h2><p>Master useState, useEffect, and other React hooks for managing component state and lifecycle.</p>',
            videoUrl: 'https://example.com/videos/react2.mp4',
            order: 2,
          },
          {
            title: 'Advanced Patterns',
            contentHtml: '<h2>Advanced React Patterns</h2><p>Learn about context API, custom hooks, and advanced component patterns.</p>',
            videoUrl: 'https://example.com/videos/react3.mp4',
            order: 3,
          },
          {
            title: 'Performance Optimization',
            contentHtml: '<h2>Optimizing React Apps</h2><p>Discover techniques to optimize your React applications for better performance.</p>',
            videoUrl: 'https://example.com/videos/react4.mp4',
            order: 4,
          },
        ],
      },
      {
        title: 'Web Design Principles',
        slug: 'web-design-principles',
        description: 'Learn the fundamental principles of modern web design. Create beautiful, user-friendly interfaces.',
        price: 39.99,
        category: 'design',
        difficulty: 'beginner',
        instructor: 'Emily Brown',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Web+Design',
        lessons: [
          {
            title: 'Design Fundamentals',
            contentHtml: '<h2>Design Basics</h2><p>Understand color theory, typography, and layout principles.</p>',
            videoUrl: 'https://example.com/videos/design1.mp4',
            order: 1,
          },
          {
            title: 'User Experience Design',
            contentHtml: '<h2>UX Design</h2><p>Learn how to create intuitive and user-friendly interfaces.</p>',
            videoUrl: 'https://example.com/videos/design2.mp4',
            order: 2,
          },
        ],
      },
      {
        title: 'Business Management',
        slug: 'business-management',
        description: 'Develop essential business management skills including leadership, team management, and strategic planning.',
        price: 59.99,
        category: 'business',
        difficulty: 'intermediate',
        instructor: 'Michael Chen',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Business+Management',
        lessons: [
          {
            title: 'Leadership Fundamentals',
            contentHtml: '<h2>Becoming a Leader</h2><p>Learn effective leadership strategies and team management.</p>',
            videoUrl: 'https://example.com/videos/biz1.mp4',
            order: 1,
          },
          {
            title: 'Strategic Planning',
            contentHtml: '<h2>Strategic Thinking</h2><p>Master the art of strategic planning and execution.</p>',
            videoUrl: 'https://example.com/videos/biz2.mp4',
            order: 2,
          },
          {
            title: 'Decision Making',
            contentHtml: '<h2>Data-Driven Decisions</h2><p>Learn to make informed business decisions using data and analytics.</p>',
            videoUrl: 'https://example.com/videos/biz3.mp4',
            order: 3,
          },
        ],
      },
      {
        title: 'Digital Marketing Strategy',
        slug: 'digital-marketing-strategy',
        description: 'Master digital marketing techniques including SEO, social media, content marketing, and paid advertising.',
        price: 49.99,
        category: 'marketing',
        difficulty: 'intermediate',
        instructor: 'Lisa Anderson',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Digital+Marketing',
        lessons: [
          {
            title: 'SEO Basics',
            contentHtml: '<h2>Search Engine Optimization</h2><p>Learn how to optimize your website for search engines.</p>',
            videoUrl: 'https://example.com/videos/marketing1.mp4',
            order: 1,
          },
          {
            title: 'Social Media Marketing',
            contentHtml: '<h2>Social Media Strategy</h2><p>Create effective social media campaigns and grow your audience.</p>',
            videoUrl: 'https://example.com/videos/marketing2.mp4',
            order: 2,
          },
          {
            title: 'Content Marketing',
            contentHtml: '<h2>Creating Compelling Content</h2><p>Master content creation and distribution strategies.</p>',
            videoUrl: 'https://example.com/videos/marketing3.mp4',
            order: 3,
          },
        ],
      },
      {
        title: 'Personal Productivity',
        slug: 'personal-productivity',
        description: 'Transform your life with productivity techniques. Learn time management, goal setting, and habit formation.',
        price: 29.99,
        category: 'personal-development',
        difficulty: 'beginner',
        instructor: 'David Williams',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Productivity',
        lessons: [
          {
            title: 'Time Management Mastery',
            contentHtml: '<h2>Managing Your Time</h2><p>Learn proven techniques to manage your time effectively.</p>',
            videoUrl: 'https://example.com/videos/prod1.mp4',
            order: 1,
          },
          {
            title: 'Goal Setting Framework',
            contentHtml: '<h2>Setting and Achieving Goals</h2><p>Master the SMART goal framework and achieve your objectives.</p>',
            videoUrl: 'https://example.com/videos/prod2.mp4',
            order: 2,
          },
          {
            title: 'Habit Formation',
            contentHtml: '<h2>Building Lasting Habits</h2><p>Learn the science of habit formation and create positive change.</p>',
            videoUrl: 'https://example.com/videos/prod3.mp4',
            order: 3,
          },
        ],
      },
      {
        title: 'Advanced Node.js',
        slug: 'advanced-nodejs',
        description: 'Take your Node.js skills to the next level. Learn about async/await, microservices, and production-ready patterns.',
        price: 89.99,
        category: 'programming',
        difficulty: 'advanced',
        instructor: 'Robert Taylor',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Advanced+Node.js',
        lessons: [
          {
            title: 'Async Programming',
            contentHtml: '<h2>Mastering Async/Await</h2><p>Deep dive into asynchronous programming in Node.js.</p>',
            videoUrl: 'https://example.com/videos/node1.mp4',
            order: 1,
          },
          {
            title: 'Building APIs',
            contentHtml: '<h2>RESTful API Development</h2><p>Create scalable and secure REST APIs with Node.js.</p>',
            videoUrl: 'https://example.com/videos/node2.mp4',
            order: 2,
          },
          {
            title: 'Database Integration',
            contentHtml: '<h2>Database Patterns</h2><p>Learn best practices for working with databases in Node.js.</p>',
            videoUrl: 'https://example.com/videos/node3.mp4',
            order: 3,
          },
          {
            title: 'Deployment',
            contentHtml: '<h2>Deploying Node.js Apps</h2><p>Deploy your applications to production with confidence.</p>',
            videoUrl: 'https://example.com/videos/node4.mp4',
            order: 4,
          },
        ],
      },
    ];

    // Insert courses
    const createdCourses = await Course.insertMany(coursesData);
    console.log(`✅ Created ${createdCourses.length} courses`);

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
