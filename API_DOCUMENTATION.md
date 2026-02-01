# API Documentation - E-Learning Platform

## Base URL
```
http://localhost:5000
```

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Token Format
- JWT with 7-day expiry
- Include in header for every authenticated request

---

## 🔐 Auth Endpoints

### POST /api/auth/signup
Create a new user account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49c1234567890abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### POST /api/auth/login
Authenticate user and get JWT token.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49c1234567890abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### GET /api/auth/me
Get current authenticated user info.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "60d5ec49c1234567890abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 📚 Courses Endpoints

### GET /api/courses
Get all courses with optional filters.

**Query Parameters:**
- `category` - Filter by category (e.g., `programming`, `design`)
- `difficulty` - Filter by difficulty (`beginner`, `intermediate`, `advanced`)
- `search` - Search in title/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```
GET /api/courses?category=programming&difficulty=beginner&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "courses": [
    {
      "_id": "60d5ec49c1234567890abcdef",
      "title": "JavaScript Fundamentals",
      "slug": "javascript-fundamentals",
      "description": "Learn JavaScript basics",
      "price": 49.99,
      "category": "programming",
      "difficulty": "beginner",
      "instructor": "John Smith",
      "thumbnailUrl": "https://...",
      "lessons": [
        {
          "_id": "60d5ec49c1234567890abcd01",
          "title": "Introduction",
          "contentHtml": "<h2>Getting Started</h2>...",
          "videoUrl": "https://...",
          "order": 1
        }
      ],
      "createdAt": "2026-02-02T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

---

### GET /api/courses/:id
Get a single course by ID or slug.

**Example:**
```
GET /api/courses/60d5ec49c1234567890abcdef
GET /api/courses/javascript-fundamentals
```

**Response (200):**
```json
{
  "success": true,
  "course": {
    "_id": "60d5ec49c1234567890abcdef",
    "title": "JavaScript Fundamentals",
    "slug": "javascript-fundamentals",
    "description": "Learn JavaScript basics",
    "price": 49.99,
    "category": "programming",
    "difficulty": "beginner",
    "instructor": "John Smith",
    "thumbnailUrl": "https://...",
    "lessons": [
      {
        "_id": "60d5ec49c1234567890abcd01",
        "title": "Introduction",
        "contentHtml": "<h2>Getting Started</h2>...",
        "videoUrl": "https://...",
        "order": 1
      }
    ],
    "createdAt": "2026-02-02T10:30:00Z"
  }
}
```

---

### POST /api/courses
Create a new course (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "title": "Advanced React",
  "slug": "advanced-react",
  "description": "Master advanced React concepts",
  "price": 99.99,
  "category": "programming",
  "difficulty": "advanced",
  "instructor": "Jane Doe",
  "thumbnailUrl": "https://...",
  "lessons": [
    {
      "title": "Lesson 1",
      "contentHtml": "<p>Content here</p>",
      "videoUrl": "https://...",
      "order": 1
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "course": { /* course object */ }
}
```

---

### PUT /api/courses/:id
Update a course (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Body:** (partial update)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 79.99
}
```

**Response (200):**
```json
{
  "success": true,
  "course": { /* updated course object */ }
}
```

---

### DELETE /api/courses/:id
Delete a course and all associated enrollments (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

### POST /api/courses/:id/lessons
Add a lesson to a course (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "title": "New Lesson",
  "contentHtml": "<h2>Lesson Content</h2><p>Details...</p>",
  "videoUrl": "https://...",
  "order": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "course": { /* updated course with new lesson */ }
}
```

---

### PUT /api/courses/:id/lessons/:lessonId
Update a lesson (admin only).

**Response (200):**
```json
{
  "success": true,
  "course": { /* updated course */ }
}
```

---

### DELETE /api/courses/:id/lessons/:lessonId
Delete a lesson (admin only).

**Response (200):**
```json
{
  "success": true,
  "course": { /* updated course */ }
}
```

---

### GET /api/courses/:id/stats
Get course statistics (admin only).

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "courseId": "60d5ec49c1234567890abcdef",
    "title": "JavaScript Fundamentals",
    "enrollments": 42,
    "lessons": 10,
    "price": 49.99,
    "category": "programming"
  }
}
```

---

## 📝 Enrollments Endpoints

### POST /api/enrollments
Enroll user in a course.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "courseId": "60d5ec49c1234567890abcdef"
}
```

**Response (201):**
```json
{
  "success": true,
  "enrollment": {
    "_id": "60d5ec49c1234567890abcd02",
    "userId": {
      "_id": "60d5ec49c1234567890abcdef",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "courseId": {
      "_id": "60d5ec49c1234567890abcdef",
      "title": "JavaScript Fundamentals"
    },
    "progress": {
      "60d5ec49c1234567890abcd01": false,
      "60d5ec49c1234567890abcd02": false
    },
    "progressPercentage": 0,
    "enrolledAt": "2026-02-02T10:30:00Z"
  }
}
```

---

### GET /api/enrollments/me
Get user's enrollments.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "enrollments": [
    {
      "_id": "60d5ec49c1234567890abcd02",
      "courseId": {
        "_id": "60d5ec49c1234567890abcdef",
        "title": "JavaScript Fundamentals",
        "slug": "javascript-fundamentals",
        "price": 49.99,
        "category": "programming"
      },
      "progress": {
        "60d5ec49c1234567890abcd01": true,
        "60d5ec49c1234567890abcd02": false
      },
      "progressPercentage": 50,
      "enrolledAt": "2026-02-02T10:30:00Z"
    }
  ]
}
```

---

### GET /api/enrollments/:id
Get a single enrollment.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "enrollment": { /* enrollment object */ }
}
```

---

### PUT /api/enrollments/:id/progress
Update lesson progress.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "lessonId": "60d5ec49c1234567890abcd01",
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "enrollment": {
    "_id": "60d5ec49c1234567890abcd02",
    "progress": {
      "60d5ec49c1234567890abcd01": true,
      "60d5ec49c1234567890abcd02": false
    },
    "progressPercentage": 50,
    "updatedAt": "2026-02-02T11:00:00Z"
  }
}
```

---

### DELETE /api/enrollments/:id
Unenroll from a course.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Unenrolled successfully"
}
```

---

### GET /api/enrollments/course/:courseId
Get all enrollments for a course (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "enrollments": [
    {
      "_id": "...",
      "userId": { /* user info */ },
      "progressPercentage": 75,
      "enrolledAt": "2026-02-02T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 3
  }
}
```

---

### GET /api/enrollments/stats/all
Get overall enrollment statistics (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalEnrollments": 156,
    "totalUsers": 89,
    "totalCourses": 12,
    "averageProgress": 45.6,
    "courseStats": [
      {
        "courseId": "60d5ec49c1234567890abcdef",
        "title": "JavaScript Fundamentals",
        "enrollments": 42,
        "averageProgress": 60
      }
    ]
  }
}
```

---

## 👥 Users Endpoints

### GET /api/users
Get all users (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "60d5ec49c1234567890abcdef",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-02-02T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 89,
    "page": 1,
    "pages": 5
  }
}
```

---

## ⭐ Reviews Endpoints

### POST /api/reviews
Create a review for an enrolled course.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "courseId": "60d5ec49c1234567890abcdef",
  "rating": 5,
  "comment": "Excellent course! Highly recommended."
}
```

**Response (201):**
```json
{
  "success": true,
  "review": {
    "_id": "60d5ec49c1234567890abcd03",
    "userId": {
      "_id": "60d5ec49c1234567890abcdef",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "courseId": "60d5ec49c1234567890abcdef",
    "rating": 5,
    "comment": "Excellent course! Highly recommended.",
    "createdAt": "2026-02-02T11:00:00Z"
  }
}
```

---

### GET /api/reviews/course/:courseId
Get all reviews for a course.

**Response (200):**
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "...",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "rating": 5,
      "comment": "Excellent course!",
      "createdAt": "2026-02-02T11:00:00Z"
    }
  ],
  "stats": {
    "averageRating": 4.5,
    "totalReviews": 24
  }
}
```

---

### PUT /api/reviews/:id
Update a review.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

**Response (200):**
```json
{
  "success": true,
  "review": { /* updated review */ }
}
```

---

### DELETE /api/reviews/:id
Delete a review.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## Error Responses

All error responses follow this format:

**Response (4xx/5xx):**
```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Status Codes
- `200` - OK (successful GET/PUT)
- `201` - Created (successful POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

---

## Testing the API

### Using cURL

**Sign up:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get courses:**
```bash
curl http://localhost:5000/api/courses?category=programming
```

**Enroll in course:**
```bash
curl -X POST http://localhost:5000/api/enrollments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId": "COURSE_ID"}'
```

### Using Postman
1. Import collection (see `POSTMAN_COLLECTION.json` if available)
2. Set environment variables: `{{base_url}}`, `{{token}}`
3. Run requests in sequence

---

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/auth.test.js
npm test -- tests/courses.test.js
npm test -- tests/enrollments.test.js

# Run with coverage
npm test -- --coverage
```

---

## Rate Limiting
Currently no rate limiting. Implement in production.

---

## CORS
Configured to accept requests from: `http://localhost:5174` (frontend dev server)

Update `CORS_ORIGIN` in `.env` for production.

---

## Security Notes
- All passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire in 7 days
- Admin routes are protected with role-based middleware
- Sensitive fields (password) are excluded from API responses
- HTTPS required in production
- Store JWT_SECRET securely in environment variables
