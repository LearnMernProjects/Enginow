const Review = require('../models/Review');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Helper function to sanitize inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

// Helper function to validate review data
const validateReviewData = (rating, comment) => {
  const errors = [];
  
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push('Rating must be an integer between 1 and 5');
  }
  
  if (comment && comment.length > 1000) {
    errors.push('Comment cannot exceed 1000 characters');
  }
  
  return errors;
};

// @desc    Create a review for a course
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    let { courseId, rating, comment } = req.body;
    const userId = req.userId;

    // Sanitize inputs
    courseId = sanitizeInput(courseId);
    rating = parseInt(rating);
    if (comment) comment = sanitizeInput(comment);

    // Validate inputs
    if (!courseId) {
      return res.status(400).json({ error: 'Please provide a course ID' });
    }

    const validationErrors = validateReviewData(rating, comment);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(403).json({ error: 'You must be enrolled to review this course' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ userId, courseId });
    if (existingReview) {
      return res.status(409).json({ error: 'You already reviewed this course' });
    }

    const review = await Review.create({
      userId,
      courseId,
      rating,
      comment: comment || '',
    });

    await review.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ courseId })
      .populate('userId', 'name email')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ courseId });

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { courseId: require('mongoose').Types.ObjectId(courseId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    res.status(200).json({
      success: true,
      reviews,
      averageRating: avgRating[0]?.avgRating || 0,
      totalReviews: total,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user/me
// @access  Private
exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ userId })
      .populate('courseId', 'title slug')
      .populate('userId', 'name email')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ userId });

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch reviews' });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    await review.populate('userId', 'name email');

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get review statistics
// @route   GET /api/reviews/stats/all
// @access  Private (Admin)
exports.getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();

    const ratingDistribution = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const avgRating = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalReviews,
        averageRating: avgRating[0]?.avgRating || 0,
        ratingDistribution: ratingDistribution.reduce((acc, item) => {
          acc[`${item._id}_stars`] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
