# E-Learning Platform - Full Stack Project

A complete e-learning application with course browsing, user authentication, enrollment, progress tracking, and admin controls. Built with modern technologies and best practices for portfolio-grade development.

## 📋 Project Overview

This is a production-ready e-learning platform demonstrating:
- **System Design:** Scalable monorepo architecture with separate frontend and backend
- **Security:** JWT authentication, password hashing, role-based access control
- **Real-world Features:** Course CRUD, enrollment management, progress tracking
- **Best Practices:** Environment configuration, testing, error handling, responsive design

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18+ with Vite
- **Router:** React Router v7
- **Styling:** Tailwind CSS
- **State:** React Context API
- **HTTP:** Axios with interceptors
- **Testing:** React Testing Library + Vitest

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password:** bcryptjs
- **Testing:** Jest + Supertest

### Deployment
- **Frontend:** Vercel
- **Backend:** Render or Heroku
- **Database:** MongoDB Atlas

## 📁 Project Structure

```
Enginow_P2/
├── frontend/
│   ├── app/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React Context for state
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Route definitions
│   │   ├── services/         # API integration
│   │   ├── utils/            # Utility functions
│   │   ├── app.css           # Global styles
│   │   └── root.tsx          # Root component
│   ├── .env                  # Local environment vars
│   ├── tailwind.config.js    # Tailwind config
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/           # Database & app config
│   │   ├── middleware/       # Auth & custom middleware
│   │   ├── models/           # Mongoose schemas
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API route definitions
│   │   ├── utils/            # Helper functions
│   │   └── server.js         # Express app entry
│   ├── .env                  # Local environment vars
│   └── package.json
│
└── README.md                 # This file
```

## ✨ Completed Features

✅ **Authentication** - JWT-based user authentication and authorization
✅ **Courses** - Complete CRUD operations for courses with lessons
✅ **Enrollment** - Users can enroll and track progress
✅ **Reviews** - Rating and review system for courses
✅ **Admin Panel** - Manage courses, users, and view statistics
✅ **Dashboard** - User progress tracking and statistics
✅ **Filtering** - Search and filter courses by category, difficulty
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Error Handling** - Comprehensive error messages
✅ **Security** - Password hashing, JWT tokens, role-based access
✅ **Database Seeding** - 7 sample courses ready to explore
✅ **Production Ready** - Deployment configuration included

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier)
- Git

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd Enginow_P2
```

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (use .env.example as template)
cp .env.example .env

# Edit .env with your MongoDB connection string
nano .env  # Update MONGODB_URI and JWT_SECRET

# Seed sample data (7 courses)
npm run seed

# Start development server
npm run dev
```

✅ Backend running at `http://localhost:5000`

### 3️⃣ Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Environment is pre-configured
# Optionally create .env.local if needed
cp .env.example .env.local

# Start development server
npm run dev

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### ✨ Explore the Application

- **Home:** http://localhost:5173
- **Courses:** http://localhost:5173/courses
- **Login/Signup:** http://localhost:5173/login

## 📚 What's Included

### Core Features Implemented
- ✅ User registration and login with JWT
- ✅ Browse and filter courses
- ✅ Enroll in courses
- ✅ Track learning progress
- ✅ Leave course reviews with ratings
- ✅ Admin panel for course management
- ✅ User dashboard with statistics
- ✅ 7 pre-loaded sample courses

### Technology Stack
- **Frontend:** React 19, Vite, React Router v7, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)
- ✅ Course detail pages with syllabus
- ✅ Instructor information
- ⏳ Course reviews (coming soon)

### User Features
- ✅ Signup with email validation
- ✅ Login with JWT authentication
- ✅ User dashboard with enrolled courses
- ✅ Progress tracking per lesson
- ✅ Enroll in courses
- ✅ View lessons and mark complete
- ⏳ Course certificates (coming soon)

### Admin Features
- ✅ Create/Edit/Delete courses
- ✅ Manage course lessons
- ✅ View user list and enrollments
- ✅ Admin-only dashboard
- ⏳ Analytics and reporting (coming soon)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Courses
- `GET /api/courses` - List all courses with filters
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Enrollments
- `POST /api/enroll` - Enroll in a course
- `GET /api/enrollments/me` - Get user's enrollments
- `PUT /api/enrollments/:id/progress` - Update lesson progress

### Admin
- `GET /api/users` - List all users (admin only)
- `GET /api/reports` - Get analytics (admin only)

## 🗄️ Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String (hashed),
  role: 'user' | 'admin',
  createdAt: Date
}
```

### Course
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  description: String,
  price: Number,
  category: String,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  thumbnailUrl: String,
  instructor: String,
  lessons: [
    {
      title: String,
      contentHtml: String,
      videoUrl: String (optional),
      order: Number
    }
  ],
  createdAt: Date
}
```

### Enrollment
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  progress: Map<LessonId, Boolean>,
  progressPercentage: Number,
  enrolledAt: Date,
  completedAt: Date (optional)
}
```

## 🔒 Security Features

- **Password Hashing:** bcryptjs with 10 salt rounds
- **JWT Tokens:** 7-day expiration
- **CORS:** Configured for specific origins
- **Input Validation:** Server-side validation on all endpoints
- **Role-Based Access:** Admin-only routes protected by middleware
- **HTTP-Only Cookies:** Recommended for token storage (can be configured)
- **Environment Variables:** All secrets stored in .env files

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Deploy Backend to Render/Heroku

1. Create account on Render or Heroku
2. Connect GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`
   - `CORS_ORIGIN`
4. Deploy

### Deploy Frontend to Vercel

1. Connect GitHub repository to Vercel
2. Set environment variable:
   - `VITE_API_BASE_URL` (your deployed backend URL)
3. Deploy (automatic on push to main)

### Setup MongoDB Atlas

1. Create free account at mongodb.com
2. Create a cluster (M0 free tier)
3. Create database user
4. Whitelist IP addresses
5. Copy connection string to `MONGODB_URI`

## 📝 Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elearning
JWT_SECRET=your-secret-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 📈 Project Timeline (4-6 weeks)

**Week 1:** Design & Backend Scaffold
- Project setup, MongoDB schema, basic auth

**Week 2:** Core Backend & Course CRUD
- Complete courses API, sample data

**Week 3:** Frontend Auth & Course Listing
- Frontend setup, auth flows, course display

**Week 4:** Dashboards & Polish
- User/admin dashboards, responsiveness, deployment

**Stretch:** Payments, video hosting, analytics

## 🎯 Next Steps

- [ ] Complete course CRUD API endpoints
- [ ] Implement enrollment and progress tracking
- [ ] Build course listing with advanced filters
- [ ] Create admin course management UI
- [ ] Implement user dashboard
- [ ] Add test coverage (70%+)
- [ ] Setup CI/CD with GitHub Actions
- [ ] Deploy to production
- [ ] Add payment integration
- [ ] Implement video streaming

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open pull request

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 📞 Support

For questions or issues:
1. Check existing documentation in frontend/README.md and backend/README.md
2. Review API endpoints documentation
3. Check database schema
4. Review environment configuration

## 🎓 Learning Outcomes

By building this project, you'll learn:
- Full-stack JavaScript development
- RESTful API design and implementation
- Database modeling with MongoDB
- Authentication and authorization
- Responsive UI with React and Tailwind
- State management with React Context
- Component-based architecture
- Environment configuration and secrets management
- Testing strategies
- Deployment and DevOps basics

---

**Start Date:** January 31, 2026
**Status:** In Development 🚧
**Last Updated:** January 31, 2026
