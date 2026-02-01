const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Helper function to sanitize inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

// Helper function to validate course data
const validateCourseData = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (data.title.length > 200) {
    errors.push('Title cannot exceed 200 characters');
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (data.description.length > 5000) {
    errors.push('Description cannot exceed 5000 characters');
  }
  
  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required');
  }
  
  if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
    errors.push('Price must be a non-negative number');
  }
  
  if (data.difficulty && !['beginner', 'intermediate', 'advanced'].includes(data.difficulty)) {
    errors.push('Difficulty must be beginner, intermediate, or advanced');
  }
  
  return errors;
};

// @desc    Get all courses with optional filtering
// @route   GET /api/courses
// @query   ?category=&difficulty=&search=&page=&limit=
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    let { category, difficulty, search, page = 1, limit = 10 } = req.query;
    
    // Sanitize and validate pagination
    page = Math.max(1, Math.min(parseInt(page) || 1, 1000));
    limit = Math.max(1, Math.min(parseInt(limit) || 10, 100));
    
    // Sanitize search and filters
    if (category) category = sanitizeInput(category);
    if (difficulty) difficulty = sanitizeInput(difficulty);
    if (search) search = sanitizeInput(search).substring(0, 100); // Limit search length

    // Build filter object
    let filter = {};
    if (category && category.length > 0) filter.category = category;
    if (difficulty && difficulty.length > 0 && ['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }
    if (search && search.length > 0) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const courses = await Course.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      courses,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// @desc    Get single course by ID or slug
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    let { id } = req.params;
    
    // Sanitize input
    id = sanitizeInput(id);

    let course = null;

    // Check if id is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by ID
      course = await Course.findById(id);
    }

    // If not found by ID, try by slug
    if (!course) {
      course = await Course.findOne({ slug: id });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin)
exports.createCourse = async (req, res) => {
  try {
    let { title, slug, description, price, category, difficulty, thumbnailUrl, instructor, lessons } = req.body;

    // Sanitize inputs
    title = sanitizeInput(title);
    slug = sanitizeInput(slug).toLowerCase();
    description = sanitizeInput(description);
    category = sanitizeInput(category);
    instructor = sanitizeInput(instructor);
    thumbnailUrl = sanitizeInput(thumbnailUrl);

    // Validate required fields
    if (!title || !slug || !description || !category || !instructor) {
      return res.status(400).json({
        error: 'Please provide title, slug, description, category, and instructor',
      });
    }

    // Validate course data
    const validationErrors = validateCourseData({ title, slug, description, price, category, difficulty });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const course = await Course.create({
      title,
      slug,
      description,
      price: price || 0,
      category,
      difficulty: difficulty || 'beginner',
      thumbnailUrl,
      instructor,
      lessons: lessons || [],
    });

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
exports.updateCourse = async (req, res) => {
  try {
    let { id } = req.params;
    let updates = req.body;
    
    // Sanitize input ID
    id = sanitizeInput(id);

    // Sanitize all update fields
    if (updates.title) updates.title = sanitizeInput(updates.title);
    if (updates.description) updates.description = sanitizeInput(updates.description);
    if (updates.category) updates.category = sanitizeInput(updates.category);
    if (updates.instructor) updates.instructor = sanitizeInput(updates.instructor);
    if (updates.slug) updates.slug = sanitizeInput(updates.slug).toLowerCase();

    // Validate course data
    const validationErrors = validateCourseData(updates);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Don't allow slug changes
    if (updates.slug) {
      const existing = await Course.findById(id);
      if (existing && updates.slug !== existing.slug) {
        return res.status(400).json({ error: 'Cannot change course slug' });
      }
    }

    const course = await Course.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Also delete all enrollments for this course
    await Enrollment.deleteMany({ courseId: id });

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add a lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private (Admin)
exports.addLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, contentHtml, videoUrl, order } = req.body;

    if (!title || !contentHtml || order === undefined) {
      return res.status(400).json({
        error: 'Please provide title, contentHtml, and order',
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    course.lessons.push({
      title,
      contentHtml,
      videoUrl,
      order,
    });

    await course.save();

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a lesson in course
// @route   PUT /api/courses/:id/lessons/:lessonId
// @access  Private (Admin)
exports.updateLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const { title, contentHtml, videoUrl, order } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (title) lesson.title = title;
    if (contentHtml) lesson.contentHtml = contentHtml;
    if (videoUrl) lesson.videoUrl = videoUrl;
    if (order !== undefined) lesson.order = order;

    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a lesson from course
// @route   DELETE /api/courses/:id/lessons/:lessonId
// @access  Private (Admin)
exports.deleteLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    lesson.deleteOne();
    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get course statistics
// @route   GET /api/courses/:id/stats
// @access  Private (Admin)
exports.getCourseStats = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const enrollmentCount = await Enrollment.countDocuments({ courseId: id });

    const stats = {
      courseId: id,
      title: course.title,
      enrollments: enrollmentCount,
      lessons: course.lessons.length,
      price: course.price,
      category: course.category,
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
