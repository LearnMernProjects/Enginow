const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Enroll user in a course
// @route   POST /api/enrollments
// @access  Private
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.userId;

    if (!courseId) {
      return res.status(400).json({ error: 'Please provide courseId' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment with progress map for each lesson
    const progress = new Map();
    course.lessons.forEach((lesson) => {
      progress.set(lesson._id.toString(), false);
    });

    const enrollment = await Enrollment.create({
      userId,
      courseId,
      progress,
      progressPercentage: 0,
    });

    await enrollment.populate('userId', 'name email');
    await enrollment.populate('courseId', 'title');

    res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user's enrollments
// @route   GET /api/enrollments/me
// @access  Private
exports.getMyEnrollments = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const enrollments = await Enrollment.find({ userId })
      .populate('courseId')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ enrolledAt: -1 });

    const total = await Enrollment.countDocuments({ userId });

    res.status(200).json({
      success: true,
      enrollments,
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

// @desc    Get enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Private
exports.getEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const enrollment = await Enrollment.findById(id).populate('courseId').populate('userId', 'name email');

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Check if user owns this enrollment
    if (enrollment.userId._id.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { lessonId, completed } = req.body;
    const userId = req.userId;

    if (!lessonId || completed === undefined) {
      return res.status(400).json({ error: 'Please provide lessonId and completed status' });
    }

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Check if user owns this enrollment
    if (enrollment.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update progress
    enrollment.progress.set(lessonId, completed);

    // Calculate progress percentage
    const totalLessons = enrollment.progress.size;
    const completedLessons = Array.from(enrollment.progress.values()).filter(Boolean).length;
    enrollment.progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Mark as completed if all lessons done
    if (enrollment.progressPercentage === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Unenroll from course
// @route   DELETE /api/enrollments/:id
// @access  Private
exports.unenroll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Check if user owns this enrollment
    if (enrollment.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Enrollment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Unenrolled successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all enrollments for a course (Admin)
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Admin)
exports.getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const enrollments = await Enrollment.find({ courseId })
      .populate('userId', 'name email')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ enrolledAt: -1 });

    const total = await Enrollment.countDocuments({ courseId });

    res.status(200).json({
      success: true,
      enrollments,
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

// @desc    Get enrollment statistics
// @route   GET /api/enrollments/stats/all
// @access  Private (Admin)
exports.getEnrollmentStats = async (req, res) => {
  try {
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ completedAt: { $exists: true, $ne: null } });

    const avgProgress = await Enrollment.aggregate([
      {
        $group: {
          _id: null,
          avgProgressPercentage: { $avg: '$progressPercentage' },
        },
      },
    ]);

    const stats = {
      totalEnrollments,
      completedEnrollments,
      completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
      averageProgress: avgProgress[0]?.avgProgressPercentage || 0,
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
