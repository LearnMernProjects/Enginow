# 🗄️ MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas (free tier) for the E-Learning Platform.

## ⚡ Quick Summary

The backend error you're seeing is expected - the `.env` file has placeholder MongoDB credentials. You need to:
1. Create a free MongoDB Atlas cluster
2. Get the connection string
3. Update `backend/.env` with your credentials

---

## 📋 Step-by-Step MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with:
   - Email: your email
   - Password: create secure password
   - Company: Your Name (or leave as is)
4. Click "Create account"
5. Accept terms and click "Create MongoDB Account"

### Step 2: Create a Project

1. After signup, you'll see "Create your first project"
2. **Project Name:** `elearning-platform` (or any name)
3. Click "Next"
4. Click "Create Project"

### Step 3: Create a Cluster

1. Click "Build a Database"
2. **Select Tier:** Choose "M0 Sandbox" (FREE)
3. **Cloud Provider:** AWS (or your preference)
4. **Region:** Choose closest to you (e.g., `us-east-1`)
5. **Cluster Name:** `cluster0` (default is fine)
6. Click "Create Deployment"
7. Wait 1-2 minutes for cluster to build

### Step 4: Create Database User

1. On the "Security" screen, set up authentication:
   - **Username:** `elearning`
   - **Password:** `elearning123` (or create your own secure password)
   - Click "Create User"

2. Your user is created with role `Read and write to any database`

### Step 5: Whitelist Your IP

1. Click "Security" → "Network Access"
2. Click "Add IP Address"
3. Options:
   - **For Local Development:** Click "Add My Current IP"
   - **For Production:** Add your server's IP
   - **For Testing:** `0.0.0.0/0` (less secure, use only for dev)
4. Click "Confirm"

### Step 6: Get Connection String

1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Select "Drivers"
4. **Language:** Choose "Node.js"
5. **Version:** Latest
6. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 7: Update Backend .env

1. Open `backend/.env`
2. Replace the `MONGODB_URI` line:

   ```env
   MONGODB_URI=mongodb+srv://elearning:elearning123@cluster0.mongodb.net/elearning?retryWrites=true&w=majority
   ```

   **Replace:**
   - `elearning` - your username
   - `elearning123` - your password
   - `cluster0` - your cluster name (if different)

3. Save the file

### Step 8: Test Connection

1. Start backend:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   Server running on port 5000
   MongoDB Connected: cluster0.mongodb.net
   ```

   ✅ If you see this, MongoDB is connected!

---

## 🔧 Troubleshooting MongoDB Connection

### Error: `querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net`

**Cause:** MongoDB connection string is invalid or DNS can't resolve

**Fix:**
1. Double-check MONGODB_URI in `.env`
2. Verify username and password are correct
3. Check that your IP is whitelisted
4. Try adding to connection string: `?authSource=admin`

### Error: `Error: connect ECONNREFUSED`

**Cause:** MongoDB URI format is wrong

**Fix:**
1. Make sure you copied the connection string correctly
2. Verify you replaced `<username>` and `<password>`
3. Verify cluster name matches

### Error: `Error: Authentication failed`

**Cause:** Wrong username/password

**Fix:**
1. Go to MongoDB Atlas → Database Access
2. Verify your username
3. Reset password if needed
4. Update `.env` with correct credentials

### Still Not Working?

1. **Check MongoDB Atlas Dashboard:**
   - Go to https://cloud.mongodb.com
   - Click your cluster
   - Check "Activity" tab for connection attempts

2. **Verify Network:**
   - Ensure your IP is whitelisted
   - Try adding `0.0.0.0/0` temporarily (less secure)

3. **Reset Everything:**
   - Delete .env
   - Copy .env.example → .env
   - Follow steps above again

---

## 💾 Connection String Breakdown

```
mongodb+srv://elearning:elearning123@cluster0.mongodb.net/elearning?retryWrites=true&w=majority
│               │        │               │                    │         │
│               │        │               │                    │         └─ Query parameters
│               │        │               │                    └─ Database name (elearning)
│               │        │               └─ Cluster domain
│               │        └─ Password
│               └─ Username
└─ Protocol (mongodb+srv for Atlas)
```

---

## 📊 MongoDB Atlas Features (Free Tier)

| Feature | Limit |
|---------|-------|
| Storage | 512 MB |
| Connections | 3 at once |
| Data Transfer | 10 GB/month |
| Automated Backups | ❌ No |
| 24/7 Support | ❌ No |

**Sufficient for:** Learning, testing, small projects

**When to upgrade:**
- Production use
- More than 512 MB data
- Need backups
- High traffic

---

## 🔐 Security Best Practices

### ✅ Do This
- Use strong passwords (16+ chars with numbers, symbols)
- Whitelist only your IP (not 0.0.0.0/0 in production)
- Use environment variables for secrets
- Enable IP Whitelist
- Use separate user accounts for dev/prod

### ❌ Don't Do This
- Share your connection string
- Commit .env to Git
- Use simple passwords
- Whitelist 0.0.0.0/0 in production
- Store passwords in code

---

## 🔄 Common Setups

### Local Development
```env
MONGODB_URI=mongodb+srv://elearning:elearning123@cluster0.mongodb.net/elearning?retryWrites=true&w=majority
# Whitelist: Your Current IP
```

### Testing/Staging
```env
MONGODB_URI=mongodb+srv://staging-user:strong-password@cluster0.mongodb.net/elearning-test?retryWrites=true&w=majority
# Whitelist: Staging server IP
```

### Production
```env
MONGODB_URI=mongodb+srv://prod-user:very-strong-password@cluster0.mongodb.net/elearning?retryWrites=true&w=majority
# Whitelist: Production server IP only
# Enable: IP Whitelist, Two-Factor Authentication
```

---

## 📱 Viewing Your Data

### Using MongoDB Compass (Recommended)

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass) (free)
2. In Compass, click "New Connection"
3. Paste your MONGODB_URI
4. Click "Connect"
5. Explore your databases and collections

### Using MongoDB Atlas Web

1. Go to https://cloud.mongodb.com
2. Click "Clusters"
3. Click "Collections" on your cluster
4. View all data online

---

## 🧪 Test Your Connection

### From Backend

```bash
cd backend
npm run dev
# Should show: MongoDB Connected: cluster0.mongodb.net
```

### From Node.js REPL

```bash
node
> const uri = "mongodb+srv://elearning:elearning123@cluster0.mongodb.net/elearning?retryWrites=true&w=majority"
> require('mongoose').connect(uri).then(() => console.log('Connected!')).catch(e => console.log(e))
```

---

## 🚀 Next Steps After Setup

1. ✅ Backend starts successfully
2. ✅ You can sign up users
3. ✅ Users are saved in MongoDB
4. ✅ Ready to implement courses

### Start Frontend

```bash
cd frontend
npm run dev
```

### Test Sign Up Flow

1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill form and submit
4. Check MongoDB Compass to verify user was created

---

## 📞 Support

If you're stuck:

1. **Check the error message** - Usually tells you what's wrong
2. **Verify connection string** - Most common mistake
3. **Check IP whitelist** - Second most common
4. **Review MongoDB Atlas docs** - https://docs.atlas.mongodb.com/

---

## ✅ Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created M0 Sandbox cluster
- [ ] Created database user (elearning)
- [ ] Whitelisted your IP
- [ ] Copied connection string
- [ ] Updated backend/.env
- [ ] Backend starts without MongoDB error
- [ ] Can see "MongoDB Connected" message
- [ ] Ready to sign up users!

---

**Your MongoDB is now ready for the E-Learning Platform!** 🎉

When you're ready to deploy to production, follow the same steps but:
- Use a different username/password
- Whitelist production server IP only
- Consider upgrading to paid tier for better security

---

*Last Updated: January 31, 2026*
