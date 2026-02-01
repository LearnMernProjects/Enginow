# API Keys & Environment Setup Requirements

## 🔑 Current Setup - No Additional Keys Needed

Your E-Learning Platform is designed to work **without external API keys** for the core functionality. Here's what you already have:

### ✅ Currently Configured

**Backend (.env):**
- ✅ `MONGODB_URI` - Your MongoDB Atlas connection string (provided)
- ✅ `JWT_SECRET` - For token generation (built-in)
- ✅ `PORT` - Backend port (5000)
- ✅ `NODE_ENV` - Environment (development)
- ✅ `CORS_ORIGIN` - Frontend URL (http://localhost:5174)

**Frontend (.env):**
- ✅ `VITE_API_BASE_URL` - Backend API URL (http://localhost:5000)

---

## 🚀 Stretch Goals - Additional Keys for Future

The following are **optional** for enhanced features:

### 1. **Cloud Storage (for course thumbnails/videos) - OPTIONAL**

Choose ONE:

#### Option A: AWS S3
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=us-east-1
```
- Get from: https://aws.amazon.com
- Cost: ~$0.023 per GB stored

#### Option B: Cloudinary (Recommended for ease)
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- Get from: https://cloudinary.com (free tier: 25GB)
- Easier setup than S3

#### Option C: Firebase Storage
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email
```
- Get from: https://firebase.google.com (free tier available)

**When you'd need this:**
- If you want to upload custom course thumbnails
- If you want to host video files
- For production deployment

---

### 2. **Payment Processing - OPTIONAL (for paid courses)**

#### Option A: Stripe (Recommended)
```
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
- Get from: https://stripe.com (free test mode)
- Best for: Credit card payments
- Cost: 2.9% + $0.30 per transaction

#### Option B: Razorpay (for India)
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```
- Get from: https://razorpay.com
- Best for: Indian users
- Cost: 1% + GST

#### Option C: PayPal
```
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox
```
- Get from: https://paypal.com/developers

**When you'd need this:**
- Only if you want to charge money for courses
- Right now: optional, courses are free or have fixed pricing

---

### 3. **Email Service - OPTIONAL (for notifications)**

#### Option A: SendGrid
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourapp.com
```
- Get from: https://sendgrid.com (100 emails/day free)
- Best for: Email reliability

#### Option B: Gmail
```
GMAIL_USER=your.email@gmail.com
GMAIL_PASSWORD=your_app_password
```
- Get from: Google Account > App Passwords
- Best for: Simple setup

#### Option C: Mailgun
```
MAILGUN_API_KEY=key-xxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
```
- Get from: https://mailgun.com (10,000 emails/month free)

**When you'd need this:**
- Welcome emails after signup
- Course enrollment confirmations
- Password reset emails
- Progress notifications

---

### 4. **Analytics - OPTIONAL**

#### Google Analytics
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
- Get from: https://analytics.google.com (free)
- Tracks: User behavior, page views, conversions

#### Mixpanel
```
MIXPANEL_TOKEN=your_token
```
- Get from: https://mixpanel.com (free tier)
- Tracks: Custom events, funnels

---

### 5. **Deployment Services - Already Configured**

**No additional keys needed for:**
- ✅ Vercel (Frontend) - Free tier available
- ✅ Render (Backend) - Free tier available  
- ✅ MongoDB Atlas (Database) - Free tier available

---

## 📋 Quick Setup Guide

### For MVP (Minimum Viable Product)
**You're already set!** No additional keys needed:
- ✅ Authentication: JWT (built-in)
- ✅ Database: MongoDB Atlas (already connected)
- ✅ Hosting: Vercel/Render (free tiers work)
- ✅ Course thumbnails: Use placeholder URLs

### For Enhanced Features (Phase 2)
Choose based on priorities:

**Priority 1: Video Hosting**
→ Use Cloudinary or AWS S3

**Priority 2: Email Notifications**
→ Use SendGrid or Mailgun

**Priority 3: Payment Processing**
→ Use Stripe (if monetizing)

---

## 🔧 How to Add Optional Keys

### Step 1: Get the API key from provider
Example: For Cloudinary:
1. Go to https://cloudinary.com
2. Sign up (free)
3. Copy "Cloud Name", "API Key", "API Secret"

### Step 2: Add to backend/.env
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Update backend/src/server.js to use it
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

### Step 4: Create endpoints using the service
```javascript
// Example: Upload course thumbnail
router.post('/upload-thumbnail', uploadMiddleware, async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  res.json({ url: result.secure_url });
});
```

---

## 🎯 Recommendations

**For this semester/learning project:**
- **Do NOT** add paid features (Stripe, etc.)
- **Do NOT** add email services initially
- **Focus on:** Core functionality (auth, enrollments, courses, dashboard)
- **Later:** Add thumbnails if you want to upload images

**For production (next semester):**
- Add Cloudinary for image/video hosting
- Add SendGrid for email notifications
- Add Stripe if you're monetizing
- Add analytics (Google Analytics)

---

## ✅ Checklist - No Action Needed Right Now

- ✅ MongoDB Atlas: Configured ✓
- ✅ JWT: Built-in ✓
- ✅ CORS: Configured ✓
- ⏳ Cloudinary: Optional, add later if needed
- ⏳ Stripe: Optional, add later if needed
- ⏳ SendGrid: Optional, add later if needed

---

## 🚀 Current Status

**You're fully set for:**
- User authentication (signup/login)
- Course CRUD (admin)
- Course browsing & filtering
- Enrollments & progress tracking
- User dashboards
- Admin panels
- Deployment to production

**No additional API keys required!** 

The platform is feature-complete for learning purposes. Add keys for specific features as you expand.

---

## 📞 Support

If you want to add any of these services:
1. Read the service documentation
2. Get the API key
3. Add to `.env` file
4. Install the npm package
5. Create the integration in a new controller/route

All services follow similar patterns and are well-documented.
