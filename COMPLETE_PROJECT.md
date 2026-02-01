# E-Learning Platform - Full Stack Project

A complete, production-ready e-learning platform with course browsing, user authentication, enrollment management, progress tracking, and admin controls. Built with React 19, Node.js, Express, and MongoDB.

## 🎯 Features

### 🌍 Public Features
- ✅ Browse all available courses with responsive grid layout
- ✅ Search courses by title and description
- ✅ Filter by category (Programming, Design, Business, Marketing, Personal Development)
- ✅ Filter by difficulty level (Beginner, Intermediate, Advanced)
- ✅ View detailed course information, lessons, and student reviews
- ✅ Pagination for course listings
- ✅ View instructor information and course ratings

### 👤 User Features (Authenticated)
- ✅ User registration and login with JWT authentication
- ✅ Enroll in courses with one click
- ✅ Track learning progress per lesson
- ✅ View progress percentage for each course
- ✅ See completion badges for finished courses
- ✅ Write and manage course reviews with star ratings
- ✅ Personal dashboard showing enrolled courses and progress
- ✅ Statistics: courses enrolled, completed, reviews written

### ⚙️ Admin Features (Role-Based)
- ✅ Create new courses with full details
- ✅ Edit existing course information
- ✅ Delete courses
- ✅ Add, update, and delete lessons within courses
- ✅ View all platform users
- ✅ Delete user accounts
- ✅ View platform analytics (enrollments, completion rate, average progress)
- ✅ Admin-only access control with middleware

## 📊 Tech Stack

### Frontend Stack
- **React 19** - Latest UI framework
- **Vite 7** - Next-generation build tool
- **React Router v7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Axios** - HTTP client with interceptors
- **Context API** - State management
- **TypeScript** - Type safety (configured)

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web application framework
- **MongoDB Atlas** - NoSQL cloud database
- **Mongoose 9** - Object Data Modeling
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie middleware

## 📂 Project Structure

```
Enginow_P2/
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── CourseCard.jsx           # Individual course display
│   │   │   ├── CourseList.jsx           # Course grid container
│   │   │   ├── FilterBar.jsx            # Search and filter controls
│   │   │   ├── EnrollmentButton.jsx     # Smart enrollment action
│   │   │   ├── Header.jsx               # Navigation bar
│   │   │   ├── Footer.jsx               # Footer
│   │   │   └── PrivateRoute.jsx         # Route protection
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx          # Authentication state
│   │   ├── hooks/
│   │   │   └── useAuth.js               # Auth hook
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Landing page
│   │   │   ├── Login.jsx                # Login page
│   │   │   ├── Signup.jsx               # Signup page
│   │   │   ├── Courses.jsx              # Course listing
│   │   │   ├── CourseDetail.jsx         # Course detail with lessons
│   │   │   ├── Dashboard.jsx            # User dashboard
│   │   │   └── Admin.jsx                # Admin panel
│   │   ├── routes/                      # React Router route files
│   │   ├── services/
│   │   │   └── apiClient.js             # Axios configuration
│   │   ├── root.tsx                     # App root component
│   │   ├── routes.ts                    # Route definitions
│   │   └── app.css                      # Global styles
│   ├── public/
│   ├── .env.example
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js                  # JWT & role verification
│   │   ├── models/
│   │   │   ├── User.js                  # User schema
│   │   │   ├── Course.js                # Course with lessons
│   │   │   ├── Enrollment.js            # Progress tracking
│   │   │   └── Review.js                # Course reviews
│   │   ├── controllers/
│   │   │   ├── authController.js        # Auth logic
│   │   │   ├── coursesController.js     # Course operations
│   │   │   ├── enrollmentsController.js # Enrollment logic
│   │   │   └── reviewsController.js     # Review operations
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── coursesRoutes.js
│   │   │   ├── enrollmentsRoutes.js
│   │   │   ├── reviewsRoutes.js
│   │   │   └── usersRoutes.js
│   │   ├── utils/
│   │   │   └── jwt.js                   # JWT utilities
│   │   └── server.js                    # Express app
│   ├── seed.js                          # Database seeding
│   ├── .env.example
│   └── package.json
│
├── README.md                            # Main README
├── START_HERE.md                        # Quick start guide
├── SETUP_SUMMARY.md                     # Setup documentation
└── MONGODB_SETUP.md                     # MongoDB instructions
```

## 🚀 Quick Start Guide

### Prerequisites
✅ Node.js 16+ (verify with `node --version`)
✅ npm or yarn package manager
✅ MongoDB Atlas account (free at [mongodb.com](https://www.mongodb.com))
✅ Git installed

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd Enginow_P2
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# Get MongoDB URI from: https://www.mongodb.com/cloud/atlas
nano .env  # or use your preferred editor

# Seed sample data (7 courses)
npm run seed

# Start development server
npm run dev
```

✅ Backend running at `http://localhost:5000`

### Step 3: Frontend Setup (Open New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Frontend environment is pre-configured
# If needed, copy and modify:
cp .env.example .env.local

# Start development server
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### Step 4: Access the Application

- **Landing Page:** http://localhost:5173
- **Courses:** http://localhost:5173/courses
- **Login:** http://localhost:5173/login
- **Signup:** http://localhost:5173/signup

### Test Users
After seeding, use any email/password to create new accounts or test the platform.

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/signup          # Register new user
POST   /api/auth/login           # Login (returns JWT)
GET    /api/auth/me              # Current user (protected)
```

### Course Endpoints

```
GET    /api/courses              # List courses (with filters)
GET    /api/courses/:id          # Get single course
POST   /api/courses              # Create course (admin)
PUT    /api/courses/:id          # Update course (admin)
DELETE /api/courses/:id          # Delete course (admin)
GET    /api/courses/:id/stats    # Course statistics (admin)
```

### Lesson Endpoints

```
POST   /api/courses/:id/lessons                    # Add lesson (admin)
PUT    /api/courses/:id/lessons/:lessonId          # Update lesson (admin)
DELETE /api/courses/:id/lessons/:lessonId          # Delete lesson (admin)
```

### Enrollment Endpoints

```
POST   /api/enrollments          # Enroll in course
GET    /api/enrollments/me       # My enrollments
GET    /api/enrollments/:id      # Enrollment details
PUT    /api/enrollments/:id/progress    # Update progress
DELETE /api/enrollments/:id      # Unenroll from course
GET    /api/enrollments/stats/all       # Stats (admin)
```

### Review Endpoints

```
POST   /api/reviews              # Create review
GET    /api/reviews/course/:courseId    # Course reviews
GET    /api/reviews/user/me      # My reviews
PUT    /api/reviews/:id          # Update review
DELETE /api/reviews/:id          # Delete review
```

### User Endpoints (Admin)

```
GET    /api/users                # List all users
GET    /api/users/:id            # User details
DELETE /api/users/:id            # Delete user
```

### Query Parameters

```
# Courses listing
?category=programming&difficulty=beginner&search=javascript&page=1&limit=10

# Reviews
?page=1&limit=10

# Enrollments
?page=1&limit=20
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String (hashed),
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Course Collection
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique, URL-friendly),
  description: String,
  price: Number,
  category: String,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  thumbnailUrl: String,
  instructor: String,
  lessons: [{
    _id: ObjectId,
    title: String,
    contentHtml: String,
    videoUrl: String,
    order: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  progress: Map<LessonId, Boolean>,
  progressPercentage: Number (0-100),
  enrolledAt: Date,
  completedAt: Date (null if not completed),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Security

### JWT Flow
1. User provides credentials
2. Backend validates and returns JWT token
3. Token stored in client localStorage
4. Token sent with every API request
5. Backend validates token on protected routes

### Security Features
✅ Passwords hashed with bcryptjs (10 salt rounds)
✅ JWT tokens expire after 7 days
✅ Role-based access control (user/admin)
✅ CORS configured for frontend origin
✅ Input validation on all endpoints
✅ Environment variables for sensitive data
✅ Unique constraints on email and slug

### Protected Routes
- Authenticated routes require valid JWT
- Admin routes require `role === 'admin'`
- Client-side route guards redirect to login

## 📱 Sample Courses (Seed Data)

The project includes 7 pre-configured sample courses:

1. **JavaScript Fundamentals** - Beginner Programming
   - 3 lessons covering basics to ES6+

2. **React.js Mastery** - Intermediate Programming
   - 4 lessons on components, hooks, and patterns

3. **Web Design Principles** - Beginner Design
   - 2 lessons on design fundamentals

4. **Business Management** - Intermediate Business
   - 3 lessons on leadership and strategy

5. **Digital Marketing Strategy** - Intermediate Marketing
   - 3 lessons on SEO, social media, content

6. **Personal Productivity** - Beginner Personal Development
   - 3 lessons on time management and habits

7. **Advanced Node.js** - Advanced Programming
   - 4 lessons on async, APIs, databases

Seed with: `npm run seed` (in backend directory)

## 🌐 Deployment

### Deploy Backend to Render

1. Create account at [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Select backend directory
4. Environment variables:
   ```
   PORT=5000
   MONGODB_URI=<your-connection-string>
   JWT_SECRET=<strong-random-secret>
   NODE_ENV=production
   CORS_ORIGIN=<your-frontend-url>
   ```
5. Deploy

### Deploy Frontend to Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Import project from GitHub
3. Select frontend directory
4. Environment variable:
   ```
   VITE_API_BASE_URL=<your-backend-url>
   ```
5. Deploy

### MongoDB Atlas Setup

1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist server IPs (or allow all: 0.0.0.0/0)
4. Copy connection string
5. Replace `<password>` and `<dbname>` in .env

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🛠️ Development

### Adding New Feature

Example: Add price range filter

**Backend:**
1. Update course controller query

**Frontend:**
1. Add filter input in FilterBar
2. Update filter state
3. Pass to API call

### Common Commands

```bash
# Backend
npm run dev       # Start development
npm run start     # Start production
npm run seed      # Seed database
npm test          # Run tests

# Frontend
npm run dev       # Start development
npm run build     # Production build
npm run preview   # Preview build
npm run typecheck # Check types
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
✅ Verify MONGODB_URI in .env
✅ Check MongoDB Atlas IP whitelist
✅ Ensure credentials are correct

### CORS Error in Console
```
Access to XMLHttpRequest blocked by CORS policy
```
✅ Update CORS_ORIGIN in backend .env
✅ For local: `http://localhost:5173`
✅ Restart backend after change

### Routes Not Working
✅ Verify all routes wired in server.js
✅ Check route file names match imports
✅ Restart backend after adding new routes

### Token Issues (401 Errors)
✅ Clear localStorage in browser DevTools
✅ Verify JWT_SECRET is same in .env
✅ Check token expiration (7 days)

## 📖 Additional Documentation

- [Backend README](backend/README.md) - Detailed backend documentation
- [Frontend README](frontend/README.md) - Detailed frontend documentation
- [START_HERE.md](START_HERE.md) - Quick start checklist
- [MONGODB_SETUP.md](MONGODB_SETUP.md) - MongoDB setup guide

## 🎓 Learning Outcomes

This project teaches:
- ✅ Full-stack web development
- ✅ RESTful API design
- ✅ Database modeling with MongoDB
- ✅ JWT authentication
- ✅ React hooks and Context API
- ✅ React Router navigation
- ✅ Responsive design
- ✅ Production deployment
- ✅ Security best practices
- ✅ Error handling patterns

## 📦 Dependencies

### Backend (8 dependencies)
- express, mongoose, jsonwebtoken, bcryptjs, cors, cookie-parser, dotenv

### Frontend (7 dependencies)
- react, react-dom, react-router, axios, @react-router/node, isbot, @react-router/serve

## 📄 Environment Variables

### Backend .env
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-32-character-random-secret-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend .env.local
```
VITE_API_BASE_URL=http://localhost:5000
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit: `git commit -m 'Add amazing feature'`
3. Push: `git push origin feature/amazing-feature`
4. Pull Request

## 📞 Support

For issues:
1. Check relevant README files
2. Review error messages
3. Check browser console
4. Check backend logs

## ✨ Features Checklist

- [x] User authentication with JWT
- [x] Course CRUD operations
- [x] Course filtering and search
- [x] Enrollment management
- [x] Progress tracking
- [x] Review system with ratings
- [x] Admin dashboard
- [x] User dashboard
- [x] Responsive design
- [x] Error handling
- [x] Environment configuration
- [x] Database seeding
- [x] API documentation
- [x] Deployment ready

## 📜 License

ISC

## 🙏 Acknowledgments

Built as a comprehensive portfolio project demonstrating:
- Modern web development best practices
- Full-stack JavaScript development
- Production-ready architecture
- Scalable database design
- Security principles

---

**Ready to deploy and showcase your skills! 🚀**

For detailed setup instructions, see [START_HERE.md](START_HERE.md)
