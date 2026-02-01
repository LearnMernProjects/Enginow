const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  contentHtml: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
}, { _id: true }); // Auto-generates _id for each lesson

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['programming', 'design', 'business', 'marketing', 'personal-development'],
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    thumbnailUrl: {
      type: String,
    },
    instructor: {
      type: String,
      required: [true, 'Please provide instructor name'],
    },
    lessons: [lessonSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
