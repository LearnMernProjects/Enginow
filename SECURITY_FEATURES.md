# Security Features Implementation Guide

## Overview
This document outlines all security features implemented in the Enginow e-learning platform to protect user data and ensure secure authentication.

---

## 1. Password Hashing with bcryptjs

### Implementation
- **Library**: bcryptjs v2.4.3 (stable version)
- **Salt Rounds**: 10 (configurable in User.js)
- **Algorithm**: Bcrypt with adaptive hashing

### Files Modified
- `backend/src/models/User.js` - Pre-save hook hashes passwords before storing

### How It Works
```javascript
// Passwords are hashed before saving to database
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Password comparison during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};
```

### Security Benefits
- Passwords are never stored in plain text
- Bcrypt is slow by design (resistant to brute-force attacks)
- Each password gets a unique salt
- `10 salt rounds` = ~100ms per hash (strong security-performance balance)

---

## 2. JWT Authentication with Expiry

### Implementation
- **Library**: jsonwebtoken
- **Expiry**: 7 days (configurable via `JWT_EXPIRY` in .env)
- **Algorithm**: HS256 (HMAC SHA-256)
- **Storage**: httpOnly Cookies (server-side) + localStorage (client-side fallback)

### Configuration
```env
JWT_SECRET=your-super-secret-key-change-in-production-min-32-chars
JWT_EXPIRY=7d
```

### Files Modified
- `backend/src/utils/jwt.js` - Token generation and verification
- `backend/src/middleware/auth.js` - JWT validation middleware
- `backend/src/controllers/authController.js` - Token creation with cookie setting

### How It Works

**Token Generation**:
```javascript
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
    algorithm: 'HS256',
  });
};
```

**Token Storage (httpOnly Cookies)**:
```javascript
res.cookie('token', token, {
  httpOnly: true,              // Prevents XSS attacks
  secure: isSecure,            // Only over HTTPS in production
  sameSite: sameSite,          // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});
```

**Token Verification**:
```javascript
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};
```

### Security Benefits
- **httpOnly Cookies**: Immune to XSS attacks (JavaScript can't access)
- **Secure Flag**: Only transmitted over HTTPS in production
- **SameSite**: Prevents CSRF attacks
- **Expiry**: Forces re-authentication after 7 days
- **Algorithm Verification**: Only accepts HS256 tokens

---

## 3. Role-Based Access Control (RBAC)

### Implementation
- **Roles**: `user` (default) and `admin`
- **Middleware**: `protect` (authentication) + `adminOnly` (authorization)

### Files Modified
- `backend/src/middleware/auth.js` - Auth and role enforcement
- `backend/src/routes/*.js` - Route protection

### How It Works

**Admin Routes Example**:
```javascript
// Only authenticated admins can access
router.delete('/:id', protect, adminOnly, coursesController.deleteCourse);
```

**Admin Middleware**:
```javascript
const adminOnly = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    })
    .catch(() => res.status(500).json({ error: 'Server error' }));
};
```

### Protected Routes
- **Admin Only**:
  - DELETE `/api/courses/:id` - Delete courses
  - PUT `/api/courses/:id` - Update courses
  - POST `/api/courses` - Create courses
  - GET `/api/reviews/stats/all` - View review statistics

- **Authenticated Users**:
  - POST `/api/reviews` - Create reviews
  - PUT `/api/reviews/:id` - Update own reviews
  - DELETE `/api/reviews/:id` - Delete own reviews
  - POST `/api/enrollments` - Enroll in courses
  - GET `/api/auth/me` - Get profile

---

## 4. Input Validation (Server-Side & Client-Side)

### Server-Side Validation

#### Email Validation
```javascript
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

#### Password Validation
```javascript
const isValidPassword = (password) => {
  return password && password.length >= 6;
};
```

#### Input Sanitization
```javascript
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};
```

### Files with Validation
- `backend/src/controllers/authController.js` - Auth validation
- `backend/src/controllers/coursesController.js` - Course data validation
- `backend/src/controllers/reviewsController.js` - Review validation

### Validation Rules

**Signup/Login**:
- Email must be valid format
- Password must be 6+ characters
- Name must be 2-100 characters

**Course Creation**:
- Title: 1-200 characters (required)
- Description: 1-5000 characters (required)
- Price: Non-negative number
- Difficulty: beginner/intermediate/advanced
- Category: Required, non-empty

**Review Creation**:
- Rating: Integer 1-5 (required)
- Comment: 0-1000 characters
- User must be enrolled in course

### Client-Side Validation

#### AuthContext.jsx
```javascript
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};
```

**Benefits**:
- Immediate user feedback
- Reduced server load
- Better user experience

---

## 5. Environment Variables & Secrets Management

### Required Environment Variables
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/enginow
JWT_SECRET=your-super-secret-key-min-32-chars-random
JWT_EXPIRY=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
SECURE_COOKIES=false
SAMESITE_COOKIES=lax
```

### Production Values
```env
PORT=5000
NODE_ENV=production
SECURE_COOKIES=true
SAMESITE_COOKIES=strict
JWT_SECRET=<random-32+-char-string>
MONGODB_URI=<production-mongodb-atlas-uri>
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

### Using env.example
- `backend/.env.example` contains template with descriptions
- Never commit `.env` to version control
- Always include `.env` in `.gitignore`
- Copy `.env.example` to `.env` and update values

### Secrets Best Practices
✅ **DO**:
- Use strong random values for JWT_SECRET (32+ characters)
- Change JWT_SECRET in production
- Never log sensitive values
- Use different secrets per environment
- Rotate secrets periodically

❌ **DON'T**:
- Commit .env to Git
- Use default/example secrets in production
- Share secrets via email/chat
- Hardcode secrets in code
- Use weak/predictable secrets

---

## 6. Security Headers

### Implemented Headers
```javascript
// Prevent MIME sniffing
X-Content-Type-Options: nosniff

// Prevent clickjacking
X-Frame-Options: DENY

// XSS Protection
X-XSS-Protection: 1; mode=block

// HSTS (HTTPS enforcement)
Strict-Transport-Security: max-age=31536000; includeSubDomains

// Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'

// Referrer Policy
Referrer-Policy: strict-origin-when-cross-origin
```

### Implementation Location
`backend/src/server.js` - Security middleware

### Benefits
- **X-Content-Type-Options**: Prevents MIME sniffing attacks
- **X-Frame-Options**: Protects against clickjacking
- **X-XSS-Protection**: Legacy XSS protection
- **HSTS**: Forces HTTPS in production
- **CSP**: Restricts content sources
- **Referrer-Policy**: Limits referrer information

---

## 7. CORS Configuration

### Current Setup
```javascript
app.use(cors({
  origin: origins,           // Multiple origins from .env
  credentials: true,         // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}));
```

### Supported Origins
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### For Production
```env
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

### Security Considerations
- ✅ Credentials enabled (for httpOnly cookies)
- ✅ Specific methods allowed
- ✅ Specific headers allowed
- ✅ No wildcard origins in production

---

## 8. HTTP Status Codes for Security

### Proper Status Codes
- **400 Bad Request**: Invalid input validation
- **401 Unauthorized**: Missing/invalid token
- **403 Forbidden**: Valid token but insufficient permissions (admin-only)
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate resources (e.g., duplicate email)
- **500 Internal Server Error**: Server error (generic message in production)

### Example
```javascript
// Authentication failure
if (!token) return res.status(401).json({ error: 'Not authorized' });

// Authorization failure
if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

// Duplicate resource
const userExists = await User.findOne({ email });
if (userExists) return res.status(409).json({ error: 'User already exists' });
```

---

## 9. API Security Best Practices

### Request Size Limits
```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### Error Handling
```javascript
// Never expose sensitive details in production
const isProduction = process.env.NODE_ENV === 'production';
const message = isProduction ? 'Internal server error' : err.message;
```

### Rate Limiting (Recommended Future Addition)
```javascript
// Install: npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 10. Testing Security Features

### Test Scenarios

**1. Password Hashing**
```bash
# Compare hashed password
node -e "const bcrypt = require('bcryptjs'); 
bcrypt.compare('password123', '$2a$10$...').then(console.log);"
```

**2. JWT Verification**
```bash
curl -H "Authorization: Bearer invalid_token" http://localhost:5000/api/auth/me
# Expected: 401 Unauthorized
```

**3. Admin Route Protection**
```bash
# As regular user trying to delete course
curl -X DELETE -H "Authorization: Bearer user_token" \
  http://localhost:5000/api/courses/123
# Expected: 403 Forbidden
```

**4. CORS Validation**
```bash
curl -H "Origin: https://malicious.com" http://localhost:5000/api/courses
# Expected: CORS error if origin not in whitelist
```

**5. Input Validation**
```bash
# Missing required field
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
# Expected: 400 Bad Request
```

---

## 11. Security Checklist

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens with 7-day expiry
- ✅ httpOnly cookies for token storage
- ✅ Admin role-based access control
- ✅ Server-side input validation & sanitization
- ✅ Client-side validation for UX
- ✅ Secrets in .env with env.example template
- ✅ Security headers (XSS, Clickjacking, MIME-sniffing)
- ✅ CORS restricted to specific origins
- ✅ Proper HTTP status codes
- ✅ Error messages don't expose system details
- ✅ HSTS header for HTTPS enforcement
- ✅ Referrer policy set

---

## 12. Deployment Security

### Before Production Deployment

1. **Environment Setup**
   ```bash
   # Generate secure JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Update .env with production values
   JWT_SECRET=<generated-secret>
   NODE_ENV=production
   SECURE_COOKIES=true
   SAMESITE_COOKIES=strict
   ```

2. **Database Security**
   - Use MongoDB Atlas with IP whitelist
   - Enable authentication
   - Use strong passwords

3. **SSL/TLS Certificate**
   - Install SSL certificate on hosting
   - Force HTTPS redirect

4. **Secrets Management**
   - Use platform secrets (Render, Vercel, AWS Secrets Manager)
   - Never hardcode production secrets
   - Rotate secrets periodically

5. **Monitoring**
   - Monitor for suspicious login attempts
   - Log all admin actions
   - Set up alerts for errors

---

## 13. Common Vulnerabilities & Fixes

| Vulnerability | Impact | Solution |
|---|---|---|
| SQL Injection | Data breach | Use ORM (Mongoose) with parameterized queries |
| XSS | Session hijacking | httpOnly cookies, input sanitization, CSP |
| CSRF | Account takeover | SameSite cookies, CSRF tokens |
| Weak Passwords | Account compromise | Enforce 6+ char minimum, educate users |
| Expired Sessions | Unauthorized access | 7-day JWT expiry, force re-login |
| Brute Force | Account lockout | Rate limiting (future feature) |
| Man-in-the-Middle | Data interception | HTTPS only, HSTS header |
| Insecure Deserialization | RCE | Validate all inputs, don't eval |

---

## 14. Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [CORS Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## Questions?
Contact security team or refer to specific implementation in codebase.
