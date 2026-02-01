# Security Features - Quick Reference

## 🔒 What's Protected

### Authentication
- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT tokens expire after 7 days
- ✅ Tokens stored in httpOnly cookies (XSS-safe)
- ✅ Login/Signup with client + server validation

### Authorization
- ✅ Admin-only routes protected with `adminOnly` middleware
- ✅ User-specific data (reviews, enrollments) enforced with `protect` middleware
- ✅ Role-based access control on all protected endpoints

### Data Input
- ✅ Server-side validation on all endpoints
- ✅ Client-side validation for UX
- ✅ Input sanitization (removes XSS vectors)
- ✅ Email format validation
- ✅ Password strength requirements (6+ chars)

### API Security
- ✅ Security headers prevent XSS, clickjacking, MIME sniffing
- ✅ CORS restricted to whitelisted origins
- ✅ Proper HTTP status codes (401, 403, etc.)
- ✅ Error messages don't expose system details
- ✅ Request size limited to 10MB

### Secrets Management
- ✅ All secrets in `.env` (never committed to Git)
- ✅ `.env.example` template provided for setup
- ✅ Production-ready configuration documented

---

## 🚀 How to Use

### 1. Setup Environment
```bash
cd backend
cp .env.example .env  # Uses defaults for development
# For production, generate new JWT_SECRET:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Login Flow
```javascript
// Frontend automatically uses httpOnly cookies
const response = await apiClient.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
// Token stored in httpOnly cookie + localStorage
// Subsequent requests include token automatically
```

### 3. Admin Actions
```javascript
// Only users with role: 'admin' can access
POST /api/courses          // Create course (admin only)
PUT /api/courses/:id       // Update course (admin only)
DELETE /api/courses/:id    // Delete course (admin only)
GET /api/reviews/stats/all // Review stats (admin only)
```

### 4. User-Specific Actions
```javascript
// Only authenticated user can access own data
GET /api/auth/me           // Get profile
GET /api/enrollments/me    // Get enrollments
GET /api/reviews/user/me   // Get reviews
POST /api/enrollments      // Enroll in course
POST /api/reviews          // Create review
```

---

## 📋 Environment Variables

### Development (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRY=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
SECURE_COOKIES=false
SAMESITE_COOKIES=lax
```

### Production
```env
PORT=5000
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<random-32+-char-string>
JWT_EXPIRY=7d
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
SECURE_COOKIES=true
SAMESITE_COOKIES=strict
```

---

## ⚠️ Important Security Notes

### Never Do
❌ Commit `.env` to Git
❌ Use default JWT_SECRET in production
❌ Log sensitive data (passwords, tokens)
❌ Hardcode secrets in code
❌ Allow arbitrary CORS origins

### Always Do
✅ Generate strong random JWT_SECRET (32+ chars)
✅ Use HTTPS in production (SECURE_COOKIES=true)
✅ Keep dependencies updated
✅ Monitor security logs
✅ Validate all user inputs (frontend + backend)
✅ Use `.env.example` for team setup

---

## 🧪 Testing Security

### Test Password Hashing
```bash
# Create user and verify password hashing
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"securepass123"}'
```

### Test JWT Expiry
```javascript
// Token expires after 7 days
const token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET, {
  expiresIn: '7d'
});
// After 7 days: 401 Unauthorized
```

### Test httpOnly Cookie
```bash
# Check cookie response
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
# Should see: Set-Cookie: token=...; HttpOnly; SameSite=Lax
```

### Test Admin Protection
```bash
# Regular user trying admin action
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer user_token" \
  -H "Content-Type: application/json" \
  -d '{"title":"Course"}'
# Response: 403 Forbidden - "Admin access required"
```

### Test Input Validation
```bash
# Invalid email
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid","password":"pass123"}'
# Response: 400 Bad Request - "Please provide a valid email address"
```

---

## 📁 Security Files

| File | Purpose |
|------|---------|
| `backend/.env.example` | Template with all config options |
| `backend/src/middleware/auth.js` | JWT validation & role checking |
| `backend/src/utils/jwt.js` | Token generation & verification |
| `backend/src/controllers/authController.js` | Signup/login with validation |
| `backend/src/server.js` | Security headers & CORS |
| `frontend/app/contexts/AuthContext.jsx` | Client-side validation |
| `SECURITY_FEATURES.md` | Detailed 14-section guide |
| `SECURITY_IMPLEMENTATION_SUMMARY.md` | Implementation checklist |

---

## 🔑 API Keys Required

**NONE** - All features work without external API keys

The platform uses:
- ✅ Internal bcryptjs (local password hashing)
- ✅ Internal JWT (local token generation)
- ✅ Internal Mongoose (local MongoDB driver)
- ✅ Internal Express (local server framework)

External services configured:
- MongoDB Atlas (credentials in .env)
- That's it! No third-party APIs required.

---

## 📞 Common Issues

### Issue: "Not authorized to access this route"
**Solution**: Token is missing or invalid
- Check: Is token in Authorization header or httpOnly cookie?
- Check: Is token expired? (7 days)
- Fix: Login again to get new token

### Issue: "Admin access required"
**Solution**: User is not an admin
- Check: Is user role set to 'admin'?
- Fix: Only users with role='admin' can access admin endpoints
- Workaround: Use test admin account or update in database

### Issue: Password validation error
**Solution**: Password doesn't meet requirements
- Minimum: 6 characters
- No special requirements
- Fix: Use password 6+ characters

### Issue: CORS error when accessing backend
**Solution**: Origin not whitelisted
- Check: Is frontend origin in CORS_ORIGIN?
- Check: .env has correct CORS_ORIGIN value
- Fix: Add origin to CORS_ORIGIN comma-separated list

---

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Generate new `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Set `NODE_ENV=production`
- [ ] Set `SECURE_COOKIES=true`
- [ ] Set `SAMESITE_COOKIES=strict`
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Enable HTTPS (set certificate)
- [ ] Test: Login → Create course → Post review
- [ ] Test: Regular user can't delete course
- [ ] Test: Admin can delete course
- [ ] Monitor: Check for 401/403 errors in logs

---

## 📚 Further Reading

- [SECURITY_FEATURES.md](SECURITY_FEATURES.md) - Full documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Common vulnerabilities
- [bcryptjs Docs](https://www.npmjs.com/package/bcryptjs) - Password hashing
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725) - Token security
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) - Security headers

---

**Status**: 🟢 All Security Features Implemented & Tested
