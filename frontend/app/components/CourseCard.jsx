import React from 'react';
import { Link } from 'react-router';

export const CourseCard = ({ course }) => {
  const difficulty = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <Link to={`/courses/${course.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
        {/* Thumbnail */}
        <div className="w-full h-48 bg-gray-300 overflow-hidden">
          <img
            src={course.thumbnailUrl || 'https://via.placeholder.com/300x200?text=' + course.title}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {course.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${difficulty[course.difficulty]}`}>
              {course.difficulty}
            </span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {course.category}
            </span>
          </div>

          {/* Instructor and Price */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">By {course.instructor}</p>
            <p className="text-sm text-gray-700">
              {course.lessons?.length || 0} lessons
            </p>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-lg font-bold text-gray-900">
              ${course.price.toFixed(2)}
            </span>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
              View Course
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
