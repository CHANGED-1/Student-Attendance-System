import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Search, Plus, Trash2, Edit, BarChart3 } from 'lucide-react';

// ============================================
// COMPONENTS - Header.jsx
// ============================================
const Header = () => {
  return (
    <header className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Users className="text-indigo-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Student Attendance Management</h1>
      </div>
      <p className="text-gray-600">Track and manage student attendance efficiently</p>
    </header>
  );
};
export default Header;