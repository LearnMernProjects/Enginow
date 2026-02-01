const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Enrollment = require('../src/models/Enrollment');
require('dotenv').config();

describe('Enrollments Endpoints', () => {
  let userToken;
  let userId;
  let courseId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning-test');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});

    // Create user
    const userRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Enrollment User',
        email: 'enrolluser@example.com',
        password: 'password123',
      });
    userToken = userRes.body.token;
    userId = userRes.body.user.id;

    // Create course
    const adminUser = new User({
      name: 'Admin',
      email: 'admin2@example.com',
      passwordHash: 'password123',
      role: 'admin',
    });
    await adminUser.save();

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin2@example.com',
        password: 'password123',
      });

    const courseRes = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminRes.body.token}`)
      .send({
        title: 'Enrollment Test Course',
        slug: 'enrollment-test-course',
        description: 'Test course for enrollments',
        price: 49.99,
        category: 'programming',
        difficulty: 'beginner',
        instructor: 'Test Admin',
        lessons: [
          {
            title: 'Lesson 1',
            contentHtml: '<p>Content</p>',
            order: 1,
          },
          {
            title: 'Lesson 2',
            contentHtml: '<p>Content 2</p>',
            order: 2,
          },
        ],
      });
    courseId = courseRes.body.course._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/enrollments (Enroll in Course)', () => {
    it('should enroll user in course', async () => {
      const res = await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          courseId: courseId,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.enrollment).toHaveProperty('_id');
      // courseId can be either a string or an object with _id property
      const enrolledCourseId = typeof res.body.enrollment.courseId === 'string' 
        ? res.body.enrollment.courseId 
        : res.body.enrollment.courseId._id;
      expect(enrolledCourseId).toBe(courseId.toString());
    });

    it('should fail if already enrolled', async () => {
      // First enrollment succeeds
      await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ courseId: courseId });

      // Second enrollment should fail
      const res = await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ courseId: courseId });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Already enrolled');
    });

    it('should fail if course not found', async () => {
      const res = await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          courseId: new mongoose.Types.ObjectId(),
        });

      expect(res.statusCode).toBe(404);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/enrollments')
        .send({ courseId: courseId });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/enrollments/me (Get My Enrollments)', () => {
    beforeEach(async () => {
      await Enrollment.deleteMany({});
    });

    it('should get user enrollments', async () => {
      // Enroll in course
      await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ courseId: courseId });

      const res = await request(app)
        .get('/api/enrollments/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.enrollments)).toBe(true);
      expect(res.body.enrollments.length).toBeGreaterThan(0);
    });

    it('should return empty array if no enrollments', async () => {
      const newUserRes = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .get('/api/enrollments/me')
        .set('Authorization', `Bearer ${newUserRes.body.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.enrollments.length).toBe(0);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .get('/api/enrollments/me');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/enrollments/:id/progress (Update Progress)', () => {
    let enrollmentId;

    beforeEach(async () => {
      await Enrollment.deleteMany({});

      const enrollRes = await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ courseId: courseId });

      enrollmentId = enrollRes.body.enrollment._id;
    });

    it('should update lesson progress', async () => {
      const course = await Course.findById(courseId);
      const lessonId = course.lessons[0]._id;

      const res = await request(app)
        .put(`/api/enrollments/${enrollmentId}/progress`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          lessonId: lessonId,
          completed: true,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.enrollment.progress).toHaveProperty(lessonId.toString());
    });

    it('should calculate progress percentage', async () => {
      const course = await Course.findById(courseId);
      const lesson1 = course.lessons[0]._id;
      const lesson2 = course.lessons[1]._id;

      // Complete first lesson
      await request(app)
        .put(`/api/enrollments/${enrollmentId}/progress`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          lessonId: lesson1,
          completed: true,
        });

      // Complete second lesson
      const res = await request(app)
        .put(`/api/enrollments/${enrollmentId}/progress`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          lessonId: lesson2,
          completed: true,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.enrollment.progressPercentage).toBeGreaterThan(0);
      expect(res.body.enrollment.progressPercentage).toBeLessThanOrEqual(100);
    });

    it('should fail without authentication', async () => {
      const course = await Course.findById(courseId);
      const lessonId = course.lessons[0]._id;

      const res = await request(app)
        .put(`/api/enrollments/${enrollmentId}/progress`)
        .send({
          lessonId: lessonId,
          completed: true,
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/enrollments/:id (Unenroll)', () => {
    let enrollmentId;

    beforeEach(async () => {
      await Enrollment.deleteMany({});

      const enrollRes = await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ courseId: courseId });

      enrollmentId = enrollRes.body.enrollment._id;
    });

    it('should unenroll user from course', async () => {
      const res = await request(app)
        .delete(`/api/enrollments/${enrollmentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify enrollment is deleted
      const checkRes = await request(app)
        .get(`/api/enrollments/${enrollmentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(checkRes.statusCode).toBe(404);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .delete(`/api/enrollments/${enrollmentId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});
