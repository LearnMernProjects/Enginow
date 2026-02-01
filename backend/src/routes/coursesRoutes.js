const express = require('express');
const coursesController = require('../controllers/coursesController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', coursesController.getCourses);
router.get('/:id', coursesController.getCourse);

// Admin routes
router.post('/', protect, adminOnly, coursesController.createCourse);
router.put('/:id', protect, adminOnly, coursesController.updateCourse);
router.delete('/:id', protect, adminOnly, coursesController.deleteCourse);

// Lesson routes (Admin)
router.post('/:id/lessons', protect, adminOnly, coursesController.addLesson);
router.put('/:id/lessons/:lessonId', protect, adminOnly, coursesController.updateLesson);
router.delete('/:id/lessons/:lessonId', protect, adminOnly, coursesController.deleteLesson);

// Statistics route
router.get('/:id/stats', protect, adminOnly, coursesController.getCourseStats);

module.exports = router;
