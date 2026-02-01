# ⚙️ E-Learning Platform - Setup & Quick Start Guide

**Project Status:** Phase 1 Complete ✅  
**Date:** January 31, 2026  
**Next Phase:** Week 2 - Course API Implementation

---

## 🚀 Quick Start (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies (already done)
npm install

# Update .env with MongoDB URI
# (Get from MongoDB Atlas - see section below)
# nano .env  (or edit in VS Code)

# Start development server
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: cluster0.mongodb.net
```

### 2. Frontend Setup

```bash
# In another terminal, navigate to frontend
cd frontend

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x built in 2.34s

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### 3. Test the Application

- Open http://localhost:5173 in your browser
- Click "Sign Up Now"
- Fill in the form and submit
- You should see a loading state then redirect

---

## 🗄️ MongoDB Atlas Setup (First Time)

### 1. Create Free MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create organization and project
4. Click "Create" to build a cluster
5. Select:
   - **Tier:** M0 Sandbox (Free)
   - **Region:** Choose closest to you
   - **Cloud Provider:** AWS/Azure/GCP

### 2. Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. **Username:** `elearning`
4. **Password:** Generate secure password (copy it!)
5. Click "Create User"

### 3. Whitelist IP Address

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Add Current IP" (your dev machine)
   - Or use `0.0.0.0/0` for development (less secure)
4. Click "Confirm"

### 4. Get Connection String

1. Click "Databases" → "Connect"
2. Click "Connect your application"
3. Select "Node.js" driver
4. Copy the connection string
5. Replace `<username>`, `<password>`, `<dbname>` with your values

### 5. Update Backend .env

```bash
cd backend
# Edit .env file:
MONGODB_URI=mongodb+srv://elearning:YOUR_PASSWORD@cluster0.mongodb.net/elearning?retryWrites=true&w=majority
JWT_SECRET=your-secure-random-string-here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 6. Test Connection

```bash
npm run dev
```

Should see: `MongoDB Connected: cluster0.mongodb.net`

---

## 📝 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elearning?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-key-generate-a-random-string

# CORS
CORS_ORIGIN=http://localhost:5173
```

**Generate JWT_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get current user (replace TOKEN with returned token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import requests from collection (or create manually)
3. Set base URL: `http://localhost:5000`
4. Test endpoints

---

## 📚 Project Structure Reference

```
Enginow_P2/
├── backend/                          # Express API
│   ├── src/
│   │   ├── config/db.js             # Database connection
│   │   ├── middleware/auth.js       # Auth middleware
│   │   ├── models/                  # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   ├── Enrollment.js
│   │   │   └── Review.js
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── ...                  # (To be added)
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth
│   │   │   └── ...                  # (To be added)
│   │   ├── utils/jwt.js             # JWT helpers
│   │   └── server.js                # Main app
│   ├── .env                         # Secrets (not in git)
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── frontend/                         # React + Vite UI
│   ├── app/
│   │   ├── components/              # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Auth state
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Courses.jsx          # (To be implemented)
│   │   │   ├── CourseDetail.jsx     # (To be implemented)
│   │   │   ├── Dashboard.jsx        # (To be implemented)
│   │   │   └── Admin.jsx            # (To be implemented)
│   │   ├── routes/                  # Route files
│   │   ├── services/
│   │   │   └── apiClient.js         # Axios config
│   │   ├── app.css
│   │   └── root.tsx                 # Root component
│   ├── .env
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── package.json
│   └── README.md
│
├── .git/                            # Git repository
├── .gitignore
├── README.md                        # Project overview
└── SETUP_SUMMARY.md                 # Detailed summary
```

---

## 🔄 Development Workflow

### 1. Making Backend Changes

```bash
cd backend
# Make changes to files
# Nodemon watches and auto-restarts
# Check console for errors
```

### 2. Making Frontend Changes

```bash
cd frontend
# Make changes to files
# Vite hot-reloads automatically
# Check browser console for errors
```

### 3. Testing Auth Flow

1. Go to http://localhost:5173/signup
2. Enter test data
3. Submit form
4. Check:
   - No errors in console
   - Token in localStorage
   - Redirect to dashboard (may need to implement dashboard first)

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `ENOTFOUND _mongodb._tcp.cluster0.mongodb.net`
- **Cause:** MongoDB connection string not set or invalid
- **Fix:** Update MONGODB_URI in .env with valid credentials

**Error:** `Port 5000 already in use`
- **Fix:** Change PORT in .env or kill process on port 5000

### Frontend Won't Start

**Error:** `Cannot find module 'react-router'`
- **Fix:** Run `npm install` in frontend directory

**Error:** `Vite: something went wrong`
- **Fix:** 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run dev
  ```

### API Connection Issues

**Error:** `CORS policy: No 'Access-Control-Allow-Origin'`
- **Cause:** CORS_ORIGIN mismatch or backend not running
- **Fix:** 
  1. Verify backend is running: `http://localhost:5000/api/health`
  2. Check VITE_API_BASE_URL in frontend/.env
  3. Check CORS_ORIGIN in backend/.env

### Authentication Not Working

**Token not persisting:**
- Check localStorage in DevTools (F12 → Application)
- Verify JWT_SECRET is same on backend
- Check token format in API requests

---

## 📊 API Endpoints Status

| Endpoint | Method | Status | Protected |
|----------|--------|--------|-----------|
| `/api/health` | GET | ✅ Done | No |
| `/api/auth/signup` | POST | ✅ Done | No |
| `/api/auth/login` | POST | ✅ Done | No |
| `/api/auth/me` | GET | ✅ Done | Yes |
| `/api/courses` | GET | ⏳ TODO | No |
| `/api/courses/:id` | GET | ⏳ TODO | No |
| `/api/courses` | POST | ⏳ TODO | Yes (Admin) |
| `/api/courses/:id` | PUT | ⏳ TODO | Yes (Admin) |
| `/api/courses/:id` | DELETE | ⏳ TODO | Yes (Admin) |
| `/api/enroll` | POST | ⏳ TODO | Yes |
| `/api/enrollments/me` | GET | ⏳ TODO | Yes |
| `/api/enrollments/:id/progress` | PUT | ⏳ TODO | Yes |
| `/api/users` | GET | ⏳ TODO | Yes (Admin) |
| `/api/reports` | GET | ⏳ TODO | Yes (Admin) |

---

## 🎯 Next Steps (Week 2)

### Priority 1: Course API
- [ ] Create courseController.js
- [ ] Create courseRoutes.js
- [ ] Implement course CRUD endpoints
- [ ] Test with Postman/cURL

### Priority 2: Enrollment API
- [ ] Create enrollmentController.js
- [ ] Implement enrollment endpoints
- [ ] Implement progress tracking

### Priority 3: Admin Endpoints
- [ ] Create adminController.js
- [ ] Implement user listing
- [ ] Implement analytics/reports

### Priority 4: Frontend Integration
- [ ] Course listing page with filters
- [ ] Course detail page
- [ ] Enrollment functionality
- [ ] User dashboard

---

## 📦 Installing Additional Packages

### Backend

```bash
cd backend

# Add validation
npm install joi express-validator

# Add logging
npm install morgan

# Add file uploads
npm install multer

# Add testing
npm install jest --save-dev
npm install supertest --save-dev
```

### Frontend

```bash
cd frontend

# Add form handling
npm install react-hook-form

# Add UI components
npm install @headlessui/react @heroicons/react

# Add animations
npm install framer-motion

# Add testing
npm install --save-dev vitest @testing-library/react
```

---

## 🚀 Commands Reference

### Backend

```bash
cd backend

# Install dependencies
npm install

# Start development (with auto-reload)
npm run dev

# Start production
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 💾 Saving & Pushing to Git

```bash
# From project root
cd ..  # Go to Enginow_P2 root

# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "feat: Phase 1 - Auth and project setup"

# (Push to GitHub - when you're ready)
# git push origin main
```

---

## 📞 Getting Help

1. **Check Documentation**
   - Backend: `backend/README.md`
   - Frontend: `frontend/README.md`
   - Project: `README.md`

2. **Check Error Messages**
   - Backend console logs
   - Browser DevTools (F12)
   - Network tab in DevTools

3. **Common Issues**
   - MongoDB connection: Check Atlas whitelist and credentials
   - CORS errors: Check CORS_ORIGIN configuration
   - Port conflicts: Change PORT or kill processes
   - Module not found: Run `npm install` again

---

## ✅ Verification Checklist

Before moving to Phase 2, verify:

- [ ] Backend repository initialized with git
- [ ] .env files created with valid MongoDB URI
- [ ] Backend starts with `npm run dev`
- [ ] Frontend starts with `npm run dev`
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:5000/api/health
- [ ] Sign up page loads and works
- [ ] Login page loads and works
- [ ] Authentication flow completes without errors
- [ ] Token stored in localStorage
- [ ] Can see protected route message or redirect
- [ ] All documentation files are in place

---

**Ready to proceed? Move to `DEVELOPMENT_GUIDE.md` for Phase 2 tasks!**

Built with ❤️ - E-Learning Platform  
Status: 🚀 Phase 1 Complete - Ready for Phase 2
