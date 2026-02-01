const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Must be before other /user routes
router.get('/user/me', protect, reviewsController.getMyReviews);

// User routes
router.post('/', protect, reviewsController.createReview);
router.put('/:id', protect, reviewsController.updateReview);
router.delete('/:id', protect, reviewsController.deleteReview);

// Public routes - must be after specific routes
router.get('/course/:courseId', reviewsController.getCourseReviews);

// Admin routes
router.get('/stats/all', protect, adminOnly, reviewsController.getReviewStats);

module.exports = router;
