# E-Learning Platform - Backend

A Node.js + Express backend API for the E-Learning Platform with MongoDB integration, JWT authentication, and complete course management system.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **CORS:** Enabled for frontend communication
- **Testing:** Jest + Supertest (ready to implement)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                  # JWT verification & role-based access
│   ├── models/
│   │   ├── User.js                  # User schema with password hashing
│   │   ├── Course.js                # Course schema with lessons
│   │   ├── Enrollment.js            # User course enrollment tracking
│   │   └── Review.js                # Course reviews and ratings
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── coursesController.js     # Course CRUD operations
│   │   ├── enrollmentsController.js # Enrollment management
│   │   └── reviewsController.js     # Review management
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── coursesRoutes.js         # Course CRUD endpoints
│   │   ├── enrollmentsRoutes.js     # Enrollment endpoints
│   │   ├── reviewsRoutes.js         # Review endpoints
│   │   └── usersRoutes.js           # Admin user management
│   ├── utils/
│   │   └── jwt.js                   # JWT utilities
│   └── server.js                    # Express app entry point
├── seed.js                           # Database seeding with sample data
├── .env.example                      # Environment variables template
└── package.json
```

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@clustername.mongodb.net/enginow?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-chars-random
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 4. Seed sample data (optional)

```bash
npm run seed
```

This creates 7 sample courses with lessons across different categories.

### 5. Start the server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user (returns JWT)
- `GET /api/auth/me` - Get current user (protected)

### Courses (Public & Admin)
- `GET /api/courses` - List all courses with filters
- `GET /api/courses/:id` - Get single course by ID or slug
- `POST /api/courses` - Create course (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `POST /api/courses/:id/lessons` - Add lesson (Admin)
- `PUT /api/courses/:id/lessons/:lessonId` - Update lesson (Admin)
- `DELETE /api/courses/:id/lessons/:lessonId` - Delete lesson (Admin)
- `GET /api/courses/:id/stats` - Get course stats (Admin)

### Enrollments (Protected)
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/me` - Get my enrollments
- `GET /api/enrollments/:id` - Get enrollment details
- `PUT /api/enrollments/:id/progress` - Update lesson progress
- `DELETE /api/enrollments/:id` - Unenroll from course
- `GET /api/enrollments/course/:courseId` - Get course enrollments (Admin)
- `GET /api/enrollments/stats/all` - Get enrollment stats (Admin)

### Reviews (Public & Protected)
- `POST /api/reviews` - Create review (must be enrolled)
- `GET /api/reviews/course/:courseId` - Get course reviews (public)
- `GET /api/reviews/user/me` - Get my reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews/stats/all` - Get review stats (Admin)

### Users (Admin)
- `GET /api/users` - List all users (Admin)
- `GET /api/users/:id` - Get user details (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String,
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
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
  category: 'programming' | 'design' | 'business' | 'marketing' | 'personal-development',
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

### Enrollment
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  progress: Map<LessonId, Boolean>,
  progressPercentage: Number,
  enrolledAt: Date,
  completedAt: Date (nullable),
  createdAt: Date,
  updatedAt: Date
}
```

### Review
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

## Authentication Flow

1. **Signup**: POST `/api/auth/signup` with `name`, `email`, `password`
   - Returns JWT token
   - Token stored in client localStorage
   
2. **Login**: POST `/api/auth/login` with `email`, `password`
   - Returns JWT token
   - Token sent with every request in Authorization header

3. **Protected Routes**: Include token in header
   ```
   Authorization: Bearer <token>
   ```

4. **Role-Based Access**: 
   - Admin routes require `role === 'admin'`
   - Applied via `adminOnly` middleware

## Key Features

✅ **Complete Authentication**
- JWT-based with 7-day expiration
- Password hashing with bcrypt
- Role-based access control (user/admin)

✅ **Course Management**
- Full CRUD operations
- Lesson management within courses
- Category and difficulty filtering
- Search functionality

✅ **Enrollment System**
- Track user enrollments
- Progress tracking per lesson
- Completion percentage calculation
- Course statistics

✅ **Review System**
- User reviews with ratings (1-5 stars)
- Average rating calculation
- One review per user per course

✅ **Admin Dashboard**
- View all users and enrollments
- Course creation and editing
- Platform statistics

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message describing what went wrong"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

## Testing

Run tests:
```bash
npm test
```

## Security Best Practices

✅ Passwords hashed with bcryptjs (10 salt rounds)
✅ JWT tokens with 7-day expiration
✅ CORS enabled and configured
✅ Input validation on all endpoints
✅ Role-based access control
✅ Environment variables for sensitive data
✅ Compound indexes for data integrity

## Deployment

### Render (Recommended)

1. Create account on [Render](https://render.com)
2. Connect GitHub repository
3. Create Web Service from `backend` directory
4. Set environment variables in dashboard
5. Deploy automatically on git push

### Heroku

```bash
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
```

## Troubleshooting

**MongoDB Connection Error:**
- Verify MONGODB_URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

**CORS Error:**
- Update CORS_ORIGIN in .env to match frontend URL
- For local development: `http://localhost:5173`

**JWT Errors:**
- Clear localStorage on client
- Ensure JWT_SECRET is consistent
- Check token expiration

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## License

ISC
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Courses (to be implemented)
- `GET /api/courses` - List all courses with filters
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Enrollments (to be implemented)
- `POST /api/enroll` - Enroll in a course
- `GET /api/enrollments/me` - Get user's enrollments
- `PUT /api/enrollments/:id/progress` - Update progress

### Admin (to be implemented)
- `GET /api/users` - List all users (admin only)
- `GET /api/reports` - Get analytics (admin only)

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elearning
JWT_SECRET=your-secret-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Running Tests

```bash
npm test
```

## Deployment

### To Render:
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

### To Heroku:
1. Create Heroku app
2. Set environment variables
3. Deploy with `git push heroku main`

## Security Considerations

- Passwords are hashed with bcryptjs (salt rounds: 10)
- JWT tokens expire after 7 days
- Role-based access control for admin routes
- CORS is configured for specified origins
- All inputs should be validated on both client and server

## Next Steps

- [ ] Implement Course CRUD endpoints
- [ ] Implement Enrollment endpoints
- [ ] Implement Admin endpoints
- [ ] Add input validation middleware
- [ ] Add error handling middleware
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Add seed data script
