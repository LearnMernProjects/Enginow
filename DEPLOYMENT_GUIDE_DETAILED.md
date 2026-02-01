# 🚀 DEPLOYMENT GUIDE - STEP BY STEP

**Project**: Enginow E-Learning Platform  
**Date**: February 2, 2026  
**Status**: Starting Production Deployment  

---

## 📋 DEPLOYMENT PLAN

### Overview
We'll deploy in this order:
1. **Backend** → Render (5 min setup + 5 min deploy)
2. **Frontend** → Vercel (5 min setup + 3 min deploy)
3. **Database** → MongoDB Atlas (already exists, just verify)
4. **Configuration** → Set environment variables
5. **Testing** → Verify all systems working

**Total Time**: ~30-45 minutes for basic deployment

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before we start, verify you have:

- [ ] GitHub account (for connecting repos)
- [ ] Git initialized in project
- [ ] Code committed to GitHub
- [ ] All tests passing locally (38/38) ✅
- [ ] No uncommitted changes
- [ ] .env file NOT in git (should be in .gitignore) ✅
- [ ] .env.example file in git ✅

**Check your git status**:
```bash
cd c:\Users\Viraj Naik\Desktop\Enginow_P2
git status
```

**Do you have a GitHub account and is this repo on GitHub?**

---

## 🔧 STEP 1: PREPARE FOR DEPLOYMENT

### 1a. Verify Project Structure
```
Enginow_P2/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── .env.example ✅
├── frontend/
│   ├── app/
│   ├── package.json
│   └── (no .env needed, uses VITE_API_URL)
└── .gitignore (should exclude .env, node_modules)
```

### 1b. Check Environment Files

**Backend**:
```bash
# Verify .env exists locally
ls backend/.env

# Verify .env.example is in git
ls backend/.env.example
```

**Frontend**: 
```bash
# Frontend doesn't need .env file locally
# Will use VITE_API_URL from Vercel env vars
```

### 1c. Create GitHub Repository (If Not Already Done)

**If you haven't pushed to GitHub yet**:
```bash
# Initialize git (if not done)
cd c:\Users\Viraj Naik\Desktop\Enginow_P2
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Enginow e-learning platform"

# Create GitHub repo at github.com
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/Enginow_P2.git
git branch -M main
git push -u origin main
```

**If already on GitHub**:
```bash
# Just verify it's up to date
git status
git push
```

---

## 🎯 STEP 2: DEPLOY BACKEND TO RENDER

### 2a. Create Render Account
1. Go to **https://render.com**
2. Click "Sign Up"
3. Sign up with GitHub (easiest)
4. Authorize Render to access GitHub

### 2b. Create New Web Service
1. Click "New +" → "Web Service"
2. Search for your GitHub repo: **Enginow_P2**
3. Click "Connect"
4. Configure:
   - **Name**: `enginow-backend` (or similar)
   - **Environment**: `Node`
   - **Region**: `Oregon` (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `cd backend && npm install && npm run build` (or leave empty if no build)
   - **Start Command**: `cd backend && npm start`

### 2c. Set Environment Variables
Click "Environment" and add these variables:

```
MONGODB_URI = mongodb+srv://user:password@cluster.mongodb.net/elearning-production
JWT_SECRET = (generate: run 'node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"')
JWT_EXPIRY = 7d
NODE_ENV = production
SECURE_COOKIES = true
SAMESITE_COOKIES = strict
CORS_ORIGIN = https://YOUR_VERCEL_URL.vercel.app
PORT = (Render sets automatically)
```

**Generate JWT_SECRET**:
```bash
# Run this locally to get a random 32-char string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output will look like: a3f9d8c2b1e4f7a9d6c5e3b1f8a2d4c6
# Copy that and paste into Render
```

### 2d. Deploy
1. Click "Create Web Service"
2. Render will automatically start building
3. Wait for "Deploy successful" message
4. You'll get a URL like: `https://enginow-backend-xxxx.onrender.com`
5. **Save this URL** - you'll need it for frontend

### 2e. Test Backend
```bash
# Test the API is working
curl https://enginow-backend-xxxx.onrender.com/health

# Should return 200 OK
```

---

## 🎨 STEP 3: DEPLOY FRONTEND TO VERCEL

### 3a. Create Vercel Account
1. Go to **https://vercel.com**
2. Click "Sign Up"
3. Sign up with GitHub (easiest)
4. Authorize Vercel to access GitHub

### 3b. Create New Project
1. Click "Add New..." → "Project"
2. Search for your repo: **Enginow_P2**
3. Click "Import"
4. Configure:
   - **Framework Preset**: `React`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3c. Set Environment Variables
Click "Environment Variables" and add:

```
VITE_API_URL = https://enginow-backend-xxxx.onrender.com
```

(Use the Render backend URL from Step 2d)

### 3d. Deploy
1. Click "Deploy"
2. Vercel will build and deploy
3. Wait for "Production" status
4. You'll get a URL like: `https://enginow-frontend-xxxx.vercel.app`
5. **Save this URL** - this is your live app!

### 3e. Update Backend CORS
Go back to Render and update:
```
CORS_ORIGIN = https://enginow-frontend-xxxx.vercel.app
```

Then click "Manual Deploy" to redeploy with new env var.

### 3f. Test Frontend
1. Open `https://enginow-frontend-xxxx.vercel.app` in browser
2. You should see the landing page
3. Try signup/login (will connect to production backend)

---

## 🗄️ STEP 4: MONGODB ATLAS SETUP

### 4a. Verify Production Database
1. Go to **https://cloud.mongodb.com**
2. Login to your MongoDB Atlas account
3. Click your production cluster
4. Click "Connect" 
5. Choose "Drivers" and copy connection string
6. Should look like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### 4b. Whitelist Render IP
1. In MongoDB Atlas, click "Security" → "Network Access"
2. Click "Add IP Address"
3. For Render, use: `0.0.0.0/0` (all IPs)
   - Or go to Render dashboard, find your service, copy its IP if listed
4. Click "Add" and confirm

### 4c. Seed Production Data
```bash
# From your local machine, with production MONGODB_URI
cd backend

# Option 1: Run seed script directly
node seed.js

# Option 2: Or use curl to call the seed endpoint (if you have one)
curl -X POST https://enginow-backend-xxxx.onrender.com/api/admin/seed
```

This creates sample courses and users in production.

---

## 🔐 STEP 5: VERIFY DEPLOYMENT

### 5a. Test Backend Endpoints

```bash
# Test signup
curl -X POST https://enginow-backend-xxxx.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Should return: user object and JWT token

# Test courses
curl https://enginow-backend-xxxx.onrender.com/api/courses

# Should return: list of courses
```

### 5b. Test Frontend Flows

Open `https://enginow-frontend-xxxx.vercel.app` and test:

1. **Landing Page**
   - [ ] Loads without errors
   - [ ] Header and footer visible
   - [ ] CTA buttons work

2. **Signup Flow**
   - [ ] Click signup
   - [ ] Enter email, password, name
   - [ ] Submit
   - [ ] Redirects to dashboard
   - [ ] Dashboard shows "0 courses enrolled"

3. **Course Browsing**
   - [ ] Go to /courses
   - [ ] See course list
   - [ ] Filters work (category, difficulty)
   - [ ] Search works

4. **Enrollment**
   - [ ] Click on a course
   - [ ] Click "Enroll"
   - [ ] Check dashboard shows enrolled course
   - [ ] Try enrolling in same course again (should prevent duplicate)

5. **Admin Features**
   - [ ] Login with admin account
   - [ ] Go to /admin
   - [ ] Try creating a course
   - [ ] Verify it appears in public list

### 5c. Check Browser Console
- [ ] No errors in console
- [ ] No CORS errors
- [ ] API calls successful

### 5d. Check Mobile
- [ ] Open on phone/tablet
- [ ] Responsive design working
- [ ] All features accessible

---

## 🐛 TROUBLESHOOTING DEPLOYMENT

### Issue: Backend not starting on Render

**Solution**:
1. Check build logs in Render dashboard
2. Check "Logs" for errors
3. Verify environment variables are set
4. Verify MongoDB URI is correct

### Issue: CORS errors in frontend

**Solution**:
1. Check Render env var `CORS_ORIGIN` matches frontend URL exactly
2. Check frontend env var `VITE_API_URL` is correct
3. Redeploy backend after changing CORS_ORIGIN

### Issue: Frontend shows blank page

**Solution**:
1. Check browser console for errors
2. Check Vercel build logs
3. Verify VITE_API_URL env var is set
4. Check that API URL doesn't have trailing slash

### Issue: API calls fail from frontend

**Solution**:
1. Check network tab in browser
2. Verify VITE_API_URL is correct
3. Check backend is running (curl the health endpoint)
4. Check CORS_ORIGIN setting

---

## 📊 DEPLOYMENT CHECKLIST

### Before Deploying
- [ ] All code committed to GitHub
- [ ] Tests passing locally (38/38)
- [ ] No console errors locally
- [ ] .env not in git
- [ ] .env.example in git

### Backend Deployment
- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables set (7 total)
- [ ] JWT_SECRET generated
- [ ] Build successful
- [ ] Health endpoint responds

### Frontend Deployment
- [ ] Vercel account created
- [ ] Project created
- [ ] VITE_API_URL set correctly
- [ ] Build successful
- [ ] Can access landing page

### Database
- [ ] MongoDB Atlas cluster active
- [ ] IP whitelist includes Render
- [ ] Connection string tested
- [ ] Sample data seeded

### Testing
- [ ] API endpoints respond
- [ ] Signup/login works
- [ ] Course browsing works
- [ ] Enrollment works
- [ ] No CORS errors
- [ ] No console errors
- [ ] Mobile responsive

---

## 🎉 SUCCESS INDICATORS

You'll know it's working when:

✅ Landing page loads at Vercel URL  
✅ Signup/login works  
✅ Can see courses  
✅ Can enroll in courses  
✅ Dashboard shows enrolled courses  
✅ No errors in browser console  
✅ No CORS errors  
✅ Mobile looks good  
✅ Admin panel accessible  
✅ Creating courses works  

---

## 🔗 YOUR URLS (To Be Filled In)

**Backend**: `https://enginow-backend-XXXXX.onrender.com`  
**Frontend**: `https://enginow-XXXXXX.vercel.app`  
**Database**: MongoDB Atlas (production cluster)  

---

## ⏱️ TIMELINE

| Step | Task | Time |
|------|------|------|
| 1 | Setup & prepare | 5 min |
| 2 | Deploy backend | 10 min |
| 3 | Deploy frontend | 10 min |
| 4 | Configure database | 5 min |
| 5 | Test deployment | 15 min |
| **Total** | **All Steps** | **~45 min** |

---

## 📞 NEXT ACTIONS

1. **Start with GitHub**: Make sure code is on GitHub
2. **Deploy Backend**: Follow Step 2
3. **Deploy Frontend**: Follow Step 3
4. **Test Everything**: Follow Step 5

---

**Ready to start? Let's begin with Step 1!**
