# E-Learning Platform - Frontend

A modern React 19 + Vite frontend for the E-Learning Platform with React Router v7, Tailwind CSS, and Context API for authentication and state management.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** Context API
- **Language:** TypeScript/JavaScript

## Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── CourseCard.jsx           # Course listing card
│   │   ├── CourseList.jsx           # Grid of courses
│   │   ├── EnrollmentButton.jsx     # Enrollment action
│   │   ├── FilterBar.jsx            # Course filters
│   │   ├── Footer.jsx               # Footer
│   │   ├── Header.jsx               # Navigation
│   │   └── PrivateRoute.jsx         # Auth guard
│   ├── contexts/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── hooks/
│   │   └── useAuth.js               # Auth hook
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Login.jsx                # Login form
│   │   ├── Signup.jsx               # Signup form
│   │   ├── Courses.jsx              # Course listing
│   │   ├── CourseDetail.jsx         # Course detail page
│   │   ├── Dashboard.jsx            # User dashboard
│   │   └── Admin.jsx                # Admin panel
│   ├── routes/
│   │   ├── home.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── courses.tsx
│   │   ├── course-detail.tsx
│   │   ├── dashboard.tsx
│   │   └── admin.tsx
│   ├── services/
│   │   └── apiClient.js             # Axios configuration
│   ├── root.tsx                     # App root
│   ├── routes.ts                    # Route configuration
│   └── app.css                      # Global styles
├── public/
├── .env.example                     # Environment variables template
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS config
└── package.json
```

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Start development server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 5. Build for production

```bash
npm run build
```

## Pages & Features

### 🏠 Home Page (`/`)
- Marketing landing page
- CTA buttons to explore courses
- Key features showcase

### 📚 Courses Listing (`/courses`)
- Browse all available courses
- Filter by category, difficulty, price
- Search functionality
- Pagination
- Course cards with ratings

### 📖 Course Detail (`/courses/:slug`)
- Course overview
- Lesson list (preview)
- Student reviews and ratings
- Enrollment button
- Video preview (placeholder)
- Instructor information

### 🔐 Authentication
- **Login** (`/login`) - Sign in to existing account
- **Signup** (`/signup`) - Create new account
- JWT token stored in localStorage
- Auto-redirect to dashboard on success

### 📊 User Dashboard (`/dashboard`) - Protected
- View enrolled courses
- Track progress per course
- See completion status
- View written reviews
- Statistics (courses enrolled, completed, reviews)

### ⚙️ Admin Panel (`/admin`) - Protected & Admin Only
- **Courses Tab:** Create, edit, delete courses
- **Users Tab:** View all users, delete users
- **Statistics Tab:** Platform stats (enrollments, completion rate, average progress)
- Admin-only access control

## Components

### CourseCard
Displays individual course in a grid:
- Thumbnail image
- Title and description
- Instructor name
- Difficulty badge
- Category badge
- Price
- View button

### CourseList
Container for multiple course cards with:
- Grid layout (responsive)
- Loading state
- Error handling
- Empty state message

### FilterBar
Course filtering interface:
- Search by title/description
- Filter by category
- Filter by difficulty
- Reset filters button

### EnrollmentButton
Smart enrollment action:
- Shows enroll button if not enrolled
- Shows enrolled status if already enrolled
- Handles authentication redirect
- Loading and error states

### Header
Navigation bar:
- Logo/brand
- Navigation links
- Courses link
- Conditional auth display (login/signup vs dashboard/logout)
- Admin link for admins

### PrivateRoute
Route protection component:
- Redirects to login if not authenticated
- Shows loading while checking auth
- Admin-only option available

## Context API & Hooks

### AuthContext
Provides authentication state:
```javascript
{
  user,                 // Current user object
  loading,              // Auth check loading state
  error,                // Error messages
  signup(),             // Signup function
  login(),              // Login function
  logout(),             // Logout function
  isAuthenticated,      // Boolean
  isAdmin               // Boolean
}
```

### useAuth Hook
```javascript
const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
```

## API Integration

### Axios Client Configuration
- Base URL from environment variable
- Authorization header with JWT token
- Credential support for cookies
- Auto-logout on 401 responses

### Example API Calls

```javascript
// Get courses
await apiClient.get('/api/courses?category=programming&page=1');

// Enroll in course
await apiClient.post('/api/enrollments', { courseId });

// Update progress
await apiClient.put(`/api/enrollments/${enrollmentId}/progress`, {
  lessonId,
  completed: true
});

// Create review
await apiClient.post('/api/reviews', {
  courseId,
  rating: 5,
  comment: 'Great course!'
});
```

## Styling

### Tailwind CSS
- Pre-configured with custom colors
- Responsive design (mobile-first)
- Utility-first approach
- PostCSS auto-prefixer

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set environment variables:
   - `VITE_API_BASE_URL` = backend URL
4. Deploy automatically on git push

### Manual Deployment

```bash
npm run build
# Deploy the 'dist' folder to any static hosting
```

### Environment Setup for Production

```env
VITE_API_BASE_URL=https://your-backend.render.com
```

## Performance Optimizations

✅ Code splitting with React Router
✅ Lazy loading of pages
✅ Image optimization
✅ CSS minification
✅ Tree-shaking unused code
✅ Vite fast refresh during development

## Authentication Flow

1. **Signup/Login:** User submits credentials
2. **Receive JWT:** Backend returns token
3. **Store Token:** Token saved in localStorage
4. **Include Token:** Sent with every API request
5. **Protected Routes:** Redirect to login if unauthorized
6. **Logout:** Clear token and redirect

## Error Handling

All pages implement:
- Try-catch blocks
- Error state display
- User-friendly error messages
- Loading states
- Retry mechanisms

## Key Features

✅ **Public Pages**
- Landing page with marketing copy
- Course browsing with filtering
- Course detail view

✅ **Authenticated Pages**
- User dashboard with progress tracking
- Admin panel for course management
- Enrollment management

✅ **Security**
- Protected routes with role checking
- JWT token management
- Secure API communication

✅ **User Experience**
- Responsive design
- Real-time search
- Pagination
- Progress visualization
- Loading indicators

## Development

### Available Scripts

```bash
npm run dev         # Start dev server
npm run build       # Production build
npm run preview     # Preview production build
npm run typecheck   # Check TypeScript
```

### Code Style

- Follow React best practices
- Use functional components
- Hooks for state management
- PropTypes or TypeScript for type safety

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

**API calls fail with 401:**
- Check token in localStorage
- Verify backend is running
- Check CORS_ORIGIN in backend

**Routes not working:**
- Ensure React Router is properly configured
- Check routes.ts for correct paths

**Styles not loading:**
- Run `npm run build` to ensure Tailwind CSS is compiled
- Clear browser cache

**State not persisting:**
- Token is stored in localStorage, not persistent storage
- Implement localStorage for other state if needed

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## License

ISC