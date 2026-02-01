import React, { useState } from 'react';

export const FilterBar = ({ onFilterChange, loading = false }) => {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ category, difficulty, search });
  };

  const handleReset = () => {
    setCategory('');
    setDifficulty('');
    setSearch('');
    onFilterChange({ category: '', difficulty: '', search: '' });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    // Debounce search
    setTimeout(() => {
      onFilterChange({ category, difficulty, search: value });
    }, 300);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Filter Courses</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Course name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setTimeout(() => {
                onFilterChange({ category: e.target.value, difficulty, search });
              }, 100);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="marketing">Marketing</option>
            <option value="personal-development">Personal Development</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setTimeout(() => {
                onFilterChange({ category, difficulty: e.target.value, search });
              }, 100);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
