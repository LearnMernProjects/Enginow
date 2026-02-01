# 🔧 Troubleshooting Guide - E-Learning Platform

**Status:** Just fixed! ✅

---

## ✅ ISSUES FIXED

### ✅ Issue 1: Frontend Tailwind CSS Error (FIXED)

**Error Message:**
```
[plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. 
The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS 
you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

**What Was Wrong:**
- Tailwind CSS v4+ moved PostCSS plugin to a separate package
- Old `postcss.config.js` was using `tailwindcss` directly
- `app.css` had old Tailwind v3 syntax

**What We Fixed:**
1. ✅ Installed `@tailwindcss/postcss` package
2. ✅ Updated `postcss.config.js` to use `@tailwindcss/postcss`
3. ✅ Simplified `app.css` to just `@import "tailwindcss"`

**Result:**
```
✅ Frontend now starts without CSS errors
✅ Tailwind styling is working
✅ Available on: http://localhost:5174 (or 5173)
```

---

### ⏳ Issue 2: Backend MongoDB Connection Error (EXPECTED)

**Error Message:**
```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net
[nodemon] app crashed - waiting for file changes before starting...
```

**Why It Happened:**
- `.env` file has placeholder MongoDB credentials
- `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/...`
- Need valid MongoDB Atlas cluster to connect

**Solution:**
Follow the guide: [MONGODB_SETUP.md](./MONGODB_SETUP.md)

Quick Steps:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create M0 Sandbox cluster
4. Create user: `elearning` / `elearning123`
5. Get connection string
6. Update `backend/.env` with connection string
7. Restart backend

**Expected Output After Setup:**
```
Server running on port 5000
MongoDB Connected: cluster0.mongodb.net
```

---

## 🚀 CURRENT STATUS

### Frontend ✅ RUNNING
```
$ npm run dev
  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

**What's Working:**
- ✅ Homepage loads
- ✅ Tailwind CSS styling applied
- ✅ Navigation working
- ✅ All pages accessible (placeholders)
- ✅ Sign up form visible
- ✅ Login form visible

**To Test:** Open http://localhost:5174

---

### Backend ⏳ WAITING FOR MONGODB

**Current State:**
- Express server starts on port 5000 ✅
- App crashes when trying to connect to MongoDB ❌
- **Reason:** No valid MongoDB credentials in .env

**To Fix:**
1. Read: [MONGODB_SETUP.md](./MONGODB_SETUP.md)
2. Create MongoDB Atlas cluster
3. Update `backend/.env` with connection string
4. Restart backend: `npm run dev`

---

## 📋 QUICK SETUP CHECKLIST

### Frontend
- [x] React + Vite installed
- [x] React Router configured
- [x] Tailwind CSS fixed ✨ (JUST FIXED)
- [x] Context API setup
- [x] All components created
- [x] All pages created
- [x] Running on localhost:5174 ✨

### Backend
- [x] Express.js installed
- [x] MongoDB Mongoose installed
- [x] JWT authentication implemented
- [x] Database schemas created
- [x] Auth endpoints created
- [x] .env files created
- [ ] MongoDB Atlas cluster needed ⏳

### Database
- [ ] MongoDB Atlas account
- [ ] Cluster created
- [ ] User created
- [ ] IP whitelisted
- [ ] Connection string in .env

---

## 🔍 DETAILED TROUBLESHOOTING

### Frontend Not Starting?

**Error: `Cannot find module...`**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Error: `Port already in use`**
```bash
# Kill process on port 5173/5174
# Or start with different port
npm run dev -- --port 3000
```

**Error: `Tailwind styles not applying`**
```bash
# Verify the fix was applied
cat postcss.config.js
# Should show: '@tailwindcss/postcss': {}

cat app/app.css
# Should show: @import "tailwindcss";

# If not, apply manual fixes (see below)
```

---

### Backend Not Starting?

**Error: `MongoDB connection failed`**

This is EXPECTED and requires MongoDB setup. See [MONGODB_SETUP.md](./MONGODB_SETUP.md)

```bash
# Verify .env has placeholder (this is ok for now)
cat .env

# Once you add MongoDB URI, restart
npm run dev
# Should see: MongoDB Connected: ...
```

**Error: `Port 5000 already in use`**
```bash
# Change in backend/.env
PORT=5001

# Or kill process
kill -f node
```

**Error: `Cannot find module...`**
```bash
# Reinstall dependencies
npm install
npm run dev
```

---

### API Connection Issues (After MongoDB Setup)

**Frontend can't connect to backend**

Check:
1. Is backend running on port 5000?
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"Backend is running"}
   ```

2. Is VITE_API_BASE_URL correct in `frontend/.env`?
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. Check browser console (F12) for CORS errors
   - Usually means backend CORS_ORIGIN doesn't match frontend URL
   - In `backend/.env`, verify: `CORS_ORIGIN=http://localhost:5174`

---

### Authentication Issues

**Sign up works but login fails**

Check:
1. User created in MongoDB?
   - Use MongoDB Compass to check
   - Or use MongoDB Atlas web interface

2. Password correct?
   - Passwords are hashed, check the hash is different

3. JWT_SECRET same on backend and frontend?
   - Both should have: `JWT_SECRET=your-secret-key-here`
   - Or let it use default from .env

**Token not persisting**

Check browser DevTools:
1. Open F12 → Application → Local Storage
2. Look for `token` key
3. Should contain JWT token

If missing:
1. Check sign up form submits successfully
2. Check browser console for errors
3. Verify localStorage works: `localStorage.setItem('test', 'value')`

---

## 📁 FILES TO CHECK

### Frontend Files
```
frontend/
├── .env                    ← Check API URL
├── postcss.config.js       ← Should use @tailwindcss/postcss ✨
├── app/app.css             ← Should be simplified ✨
├── app/root.tsx            ← Has AuthProvider
├── app/pages/Login.jsx     ← Login form
├── app/pages/Signup.jsx    ← Signup form
└── app/contexts/AuthContext.jsx ← Auth state
```

### Backend Files
```
backend/
├── .env                    ← Update with MongoDB URI ⏳
├── .env.example            ← Template
├── src/server.js           ← Express app
├── src/config/db.js        ← MongoDB connection
├── src/models/User.js      ← User schema
└── src/controllers/authController.js ← Auth logic
```

---

## 🔗 IMPORTANT LINKS

### Documentation
- **Main Setup:** [START_HERE.md](./START_HERE.md)
- **Quick Start:** [QUICKSTART.md](./QUICKSTART.md)
- **MongoDB Setup:** [MONGODB_SETUP.md](./MONGODB_SETUP.md) ← START HERE IF MONGODB ERROR
- **Tech Details:** [SETUP_SUMMARY.md](./SETUP_SUMMARY.md)
- **Full Project:** [README.md](./README.md)

### MongoDB
- **Website:** https://www.mongodb.com/cloud/atlas
- **Docs:** https://docs.atlas.mongodb.com
- **Compass:** https://www.mongodb.com/try/download/compass

### VS Code Extensions (Recommended)
- REST Client - for testing APIs
- MongoDB for VS Code - for viewing database
- Tailwind CSS IntelliSense - for CSS hints

---

## ✅ VERIFY EVERYTHING WORKS

### Step 1: Frontend Running?
```bash
curl http://localhost:5174
# Or open in browser
```

✅ Should show HTML page with content

### Step 2: Backend Server Running?
```bash
curl http://localhost:5000/api/health
# Should show: {"status":"Backend is running"}
```

### Step 3: MongoDB Connected?
```bash
npm run dev
# Should show: MongoDB Connected: cluster0.mongodb.net
```

If you see all three: ✅ **EVERYTHING IS WORKING!**

---

## 🎯 NEXT STEPS

### Immediate
1. ✅ Frontend is running - DONE
2. ⏳ Setup MongoDB - See [MONGODB_SETUP.md](./MONGODB_SETUP.md)
3. ⏳ Restart backend when MongoDB is ready

### After MongoDB is Setup
1. Test sign up flow
2. Check MongoDB for created users
3. Test login flow
4. Ready for Phase 2 development

---

## 💬 COMMON QUESTIONS

### Q: Why did Tailwind CSS break?
**A:** Tailwind v4 moved PostCSS plugin to separate package. We installed `@tailwindcss/postcss` and updated config. This is now fixed.

### Q: Why does backend crash?
**A:** MongoDB connection string is placeholder. Need real MongoDB Atlas cluster. See MONGODB_SETUP.md.

### Q: Can I use the app without MongoDB?
**A:** Frontend works fine. Backend API won't work (needs database). For testing frontend only, you can mock API responses.

### Q: How long does MongoDB setup take?
**A:** About 5-10 minutes to create cluster. Cluster starts immediately once created.

### Q: Is MongoDB free?
**A:** Yes, M0 Sandbox tier is free forever. Includes 512 MB storage, perfect for learning.

### Q: Can I change MongoDB password later?
**A:** Yes, in MongoDB Atlas → Database Access → click user → edit password.

---

## 🆘 Still Having Issues?

### Debug Mode

1. **Clear everything and reinstall:**
   ```bash
   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json .vite
   npm install
   npm run dev
   
   # Backend (in new terminal)
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **Check environment variables:**
   ```bash
   # Frontend
   cat frontend/.env
   
   # Backend
   cat backend/.env
   ```

3. **Check ports are available:**
   ```bash
   netstat -ano | findstr :5173
   netstat -ano | findstr :5000
   ```

4. **Check Node version:**
   ```bash
   node --version
   # Should be 16+
   ```

### Getting Help

1. Read the relevant documentation file (see links above)
2. Check the error message - usually explains the problem
3. Check browser console (F12) for frontend errors
4. Check terminal console for backend errors
5. Check MongoDB Atlas dashboard for connection issues

---

## 📞 SUPPORT RESOURCES

- **Project README:** [README.md](./README.md)
- **MongoDB Help:** [MONGODB_SETUP.md](./MONGODB_SETUP.md)
- **Tailwind Docs:** https://tailwindcss.com
- **React Router Docs:** https://reactrouter.com
- **Express Docs:** https://expressjs.com
- **MongoDB Docs:** https://docs.mongodb.com

---

**Status:** ✅ Frontend Fixed & Ready  
**Next:** Setup MongoDB (see [MONGODB_SETUP.md](./MONGODB_SETUP.md))  
**Time Estimate:** 5-10 minutes for MongoDB setup

**You're doing great! 🚀**

*Last Updated: January 31, 2026*
