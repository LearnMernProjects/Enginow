# 🗄️ How to View User Data in MongoDB

## What You Saw Before
That weird data with `"c"`, `"ns"`, `UUID`, etc. was **MongoDB internal protocol data**, not actual documents. MongoDB Atlas sometimes shows raw protocol frames if you're looking at system collections.

## ✅ Proper Way to View Users

### Method 1: MongoDB Atlas Web Console (Recommended)

1. Go to https://cloud.mongodb.com/
2. Log in with your account
3. Click on "Enginow" cluster
4. Click "Collections"
5. Select database: **enginow**
6. Select collection: **users**
7. You'll see all user documents like:

```json
{
  "_id": ObjectId("697fb604b0cc52f4c60f42dd"),
  "name": "Test User",
  "email": "test@example.com",
  "passwordHash": "$2a$10$YCVuQd7JWtrjk.yhvYLA5eF26V0YpyID6LMEw1RAnACCAfx6NsLDC",
  "role": "user",
  "createdAt": ISODate("2026-02-02T01:52:28.000Z"),
  "updatedAt": ISODate("2026-02-02T01:52:28.000Z"),
  "__v": 0
}
```

### Method 2: Using Node Script (Terminal)

Run this command to see all users:
```bash
cd backend
node viewUsers.js
```

### Method 3: MongoDB Compass (Desktop App)

1. Download MongoDB Compass: https://www.mongodb.com/products/tools/compass
2. Connect with your MongoDB URI
3. Browse collections visually
4. See users in human-readable format

---

## 🔐 Understanding Password Storage

### Original Password
```
password123
```

### Hashed Password (stored in DB)
```
$2a$10$YCVuQd7JWtrjk.yhvYLA5eF26V0YpyID6LMEw1RAnACCAfx6NsLDC
```

**Why it's hashed:**
- ✅ **Security**: Never store plain passwords
- ✅ **Encryption**: One-way hash (cannot be reversed)
- ✅ **Verification**: Can verify password without storing it
- ✅ **Industry Standard**: bcryptjs with salt

**When login happens:**
1. User enters `password123`
2. Backend hashes it with same salt
3. Compares hashes (not plain text)
4. If match → login successful

---

## 📊 Current Database Structure

```
DATABASE: enginow
│
├── users (collection)
│   └── {
│       _id: ObjectId,
│       name: String,
│       email: String (unique),
│       passwordHash: String (60 chars, bcrypt),
│       role: String (user/admin),
│       createdAt: Date,
│       updatedAt: Date
│     }
│
├── courses (collection)
│   └── {...}
│
├── enrollments (collection)
│   └── {...}
│
└── reviews (collection)
    └── {...}
```

---

## 🧪 Test Credentials

**Email**: test@example.com  
**Password**: password123  
**Role**: user

Use these to login at http://localhost:5173/login

---

## ✅ Data Verification Checklist

- [x] Users collection created
- [x] Password properly hashed (bcryptjs)
- [x] Email stored (plain text, searchable)
- [x] Name stored (plain text, searchable)
- [x] Role stored (user/admin)
- [x] Timestamps created (createdAt, updatedAt)
- [x] Password verification working

---

## 🚨 Important Security Notes

### ✅ What We Do Right:
1. **Passwords hashed** with bcryptjs (industry standard)
2. **Salt rounds: 10** (computationally expensive to crack)
3. **Never logged** passwords anywhere
4. **JWT tokens** used instead of sessions
5. **HTTPS** required in production

### ⚠️ Production Checklist:
- [ ] Use HTTPS only
- [ ] Enable password reset email verification
- [ ] Implement rate limiting on login
- [ ] Add 2FA (two-factor authentication)
- [ ] Monitor failed login attempts
- [ ] Regular security audits

---

## 📱 Creating More Test Users

Use the signup form at http://localhost:5173/signup to create more users!

Or create via script:
```bash
node createTestUser.js  # Creates test@example.com
```

---

**Status: Database properly configured and working! ✅**
