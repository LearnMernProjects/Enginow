import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import CourseCard from './CourseCard';

describe('CourseCard Component', () => {
  const mockCourse = {
    _id: '1',
    title: 'React Basics',
    description: 'Learn React fundamentals',
    category: 'Web Development',
    difficulty: 'Beginner',
    slug: 'react-basics',
    thumbnail: 'https://example.com/react.jpg',
    price: 29.99,
    instructor: 'John Doe',
    studentsCount: 150,
  };

  const renderComponent = (course = mockCourse) => {
    return render(
      <BrowserRouter>
        <CourseCard course={course} />
      </BrowserRouter>
    );
  };

  test('renders course title', () => {
    renderComponent();
    expect(screen.getByText('React Basics')).toBeInTheDocument();
  });

  test('renders course description', () => {
    renderComponent();
    expect(screen.getByText('Learn React fundamentals')).toBeInTheDocument();
  });

  test('renders course category', () => {
    renderComponent();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
  });

  test('renders course difficulty', () => {
    renderComponent();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  test('renders course price', () => {
    renderComponent();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  test('renders students count', () => {
    renderComponent();
    expect(screen.getByText(/150 students/i)).toBeInTheDocument();
  });

  test('contains a link to course detail page', () => {
    renderComponent();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/courses/${mockCourse.slug}`);
  });

  test('renders course image with correct src', () => {
    renderComponent();
    const image = screen.getByAltText('React Basics');
    expect(image).toHaveAttribute('src', 'https://example.com/react.jpg');
  });
});
