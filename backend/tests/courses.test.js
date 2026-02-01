const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
require('dotenv').config();

describe('Courses Endpoints', () => {
  let token;
  let adminToken;
  let courseId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning-test');
    await Course.deleteMany({});
    await User.deleteMany({});

    // Create regular user
    const userRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
      });
    token = userRes.body.token;

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'password123',
      role: 'admin',
    });
    await admin.save();
    
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });
    adminToken = adminRes.body.token;
  });

  afterAll(async () => {
    await Course.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/courses (Create Course - Admin Only)', () => {
    it('should create a new course as admin', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Advanced JavaScript',
          slug: 'advanced-javascript',
          description: 'Learn advanced JavaScript concepts',
          price: 99.99,
          category: 'programming',
          difficulty: 'advanced',
          instructor: 'John Doe',
          thumbnailUrl: 'https://example.com/thumbnail.jpg',
          lessons: [
            {
              title: 'Lesson 1',
              contentHtml: '<p>Content here</p>',
              order: 1,
            },
          ],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.course).toHaveProperty('_id');
      expect(res.body.course.title).toBe('Advanced JavaScript');
      expect(res.body.course.lessons.length).toBe(1);
      courseId = res.body.course._id;
    });

    it('should fail if non-admin tries to create course', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Unauthorized Course',
          slug: 'unauthorized-course',
          description: 'This should fail',
          category: 'programming',
          instructor: 'User',
        });

      expect(res.statusCode).toBe(403);
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Incomplete Course',
          slug: 'incomplete-course',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should fail if slug already exists', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Another Course',
          slug: 'advanced-javascript',
          description: 'Duplicate slug',
          category: 'programming',
          instructor: 'Jane Doe',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toContain('Slug already exists');
    });
  });

  describe('GET /api/courses (List Courses)', () => {
    beforeEach(async () => {
      await Course.deleteMany({});

      // Create test courses
      const courses = [
        {
          title: 'JavaScript Course',
          slug: 'js-course',
          description: 'Learn JavaScript',
          price: 49.99,
          category: 'programming',
          difficulty: 'beginner',
          instructor: 'John',
          lessons: [],
        },
        {
          title: 'React Course',
          slug: 'react-course',
          description: 'Learn React',
          price: 79.99,
          category: 'programming',
          difficulty: 'intermediate',
          instructor: 'Jane',
          lessons: [],
        },
        {
          title: 'Design Course',
          slug: 'design-course',
          description: 'Learn Design',
          price: 39.99,
          category: 'design',
          difficulty: 'beginner',
          instructor: 'Bob',
          lessons: [],
        },
      ];

      await Course.insertMany(courses);
    });

    it('should list all courses', async () => {
      const res = await request(app)
        .get('/api/courses');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.courses.length).toBeGreaterThan(0);
      expect(res.body.pagination).toHaveProperty('total');
      expect(res.body.pagination).toHaveProperty('page');
      expect(res.body.pagination).toHaveProperty('pages');
    });

    it('should filter courses by category', async () => {
      const res = await request(app)
        .get('/api/courses?category=programming');

      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(2);
      res.body.courses.forEach((course) => {
        expect(course.category).toBe('programming');
      });
    });

    it('should filter courses by difficulty', async () => {
      const res = await request(app)
        .get('/api/courses?difficulty=beginner');

      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(2);
      res.body.courses.forEach((course) => {
        expect(course.difficulty).toBe('beginner');
      });
    });

    it('should search courses', async () => {
      const res = await request(app)
        .get('/api/courses?search=React');

      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(1);
      expect(res.body.courses[0].title).toContain('React');
    });

    it('should handle pagination', async () => {
      const res = await request(app)
        .get('/api/courses?page=1&limit=2');

      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(2);
      expect(res.body.pagination.page).toBe(1);
    });
  });

  describe('GET /api/courses/:id (Get Single Course)', () => {
    beforeEach(async () => {
      await Course.deleteMany({});
      const course = new Course({
        title: 'Test Course',
        slug: 'test-course',
        description: 'Test description',
        category: 'programming',
        instructor: 'Test',
        lessons: [],
      });
      await course.save();
      courseId = course._id;
    });

    it('should get course by ID', async () => {
      const res = await request(app)
        .get(`/api/courses/${courseId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.course._id).toBe(courseId.toString());
      expect(res.body.course.title).toBe('Test Course');
    });

    it('should get course by slug', async () => {
      const res = await request(app)
        .get(`/api/courses/${courseId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.course.slug).toBe('test-course');
    });

    it('should return 404 for non-existent course', async () => {
      // Use an invalid ObjectId format
      const fakeId = '000000000000000000000000';
      const res = await request(app)
        .get(`/api/courses/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toContain('not found');
    });
  });

  describe('PUT /api/courses/:id (Update Course - Admin Only)', () => {
    beforeEach(async () => {
      await Course.deleteMany({});
      const course = new Course({
        title: 'Original Title',
        slug: 'original-slug',
        description: 'Original description',
        category: 'programming',
        instructor: 'Original',
        lessons: [],
      });
      await course.save();
      courseId = course._id;
    });

    it('should update course as admin', async () => {
      const res = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Title',
          description: 'Updated description',
          category: 'programming',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.course).toHaveProperty('title');
      expect(res.body.course).toHaveProperty('description');
    });

    it('should fail if non-admin tries to update', async () => {
      const res = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Unauthorized Update' });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/courses/:id (Delete Course - Admin Only)', () => {
    beforeEach(async () => {
      await Course.deleteMany({});
      const course = new Course({
        title: 'Course to Delete',
        slug: 'course-to-delete',
        description: 'This will be deleted',
        category: 'programming',
        instructor: 'Admin',
        lessons: [],
      });
      await course.save();
      courseId = course._id;
    });

    it('should delete course as admin', async () => {
      const res = await request(app)
        .delete(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify course is deleted
      const checkRes = await request(app)
        .get(`/api/courses/${courseId}`);
      expect(checkRes.statusCode).toBe(404);
    });

    it('should fail if non-admin tries to delete', async () => {
      const res = await request(app)
        .delete(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
