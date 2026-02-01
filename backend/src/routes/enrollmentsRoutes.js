const express = require('express');
const enrollmentsController = require('../controllers/enrollmentsController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// User routes (Protected)
router.post('/', protect, enrollmentsController.enrollCourse);
router.get('/me', protect, enrollmentsController.getMyEnrollments);
router.get('/:id', protect, enrollmentsController.getEnrollment);
router.put('/:id/progress', protect, enrollmentsController.updateProgress);
router.delete('/:id', protect, enrollmentsController.unenroll);

// Admin routes
router.get('/course/:courseId', protect, adminOnly, enrollmentsController.getCourseEnrollments);
router.get('/stats/all', protect, adminOnly, enrollmentsController.getEnrollmentStats);

module.exports = router;
