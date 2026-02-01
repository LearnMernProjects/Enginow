import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Learn New Skills, Advance Your Career
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Access high-quality courses taught by industry experts. Learn at your own pace and achieve your goals.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/courses"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Explore Courses
          </Link>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose ELearning?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-2xl font-semibold mb-4">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of real-world experience.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold mb-4">Diverse Curriculum</h3>
              <p className="text-gray-600">
                Choose from hundreds of courses across programming, design, business, and more.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-2xl font-semibold mb-4">Learn at Your Pace</h3>
              <p className="text-gray-600">
                Study whenever and wherever you want with lifetime access to course materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8">Join thousands of students advancing their careers today.</p>
          {isAuthenticated ? (
            <Link
              to="/courses"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Browse All Courses
            </Link>
          ) : (
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
