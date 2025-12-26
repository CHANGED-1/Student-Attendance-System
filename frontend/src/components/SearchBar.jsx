import React from 'react';
import { Calendar, Search } from 'lucide-react';
// ============================================
// COMPONENTS - SearchBar.jsx
// ============================================
const SearchBar = ({ searchTerm, setSearchTerm, selectedDate, setSelectedDate }) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-4">
        <Calendar className="text-indigo-600" size={24} />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search students by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;