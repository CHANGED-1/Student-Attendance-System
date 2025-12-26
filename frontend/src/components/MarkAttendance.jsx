import React from 'react';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import apiService from '../services/api.js';

// ============================================
// COMPONENTS - MarkAttendance.jsx
// ============================================
const MarkAttendance = ({ students, selectedDate, onMarkAttendance, searchTerm }) => {
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No students found</p>
        </div>
      ) : (
        filteredStudents.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{student.name}</h3>
              <p className="text-sm text-gray-600">
                Roll: {student.roll_number} | Class: {student.class}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onMarkAttendance(student.id, 'present')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm"
              >
                <CheckCircle size={18} />
                <span className="hidden sm:inline">Present</span>
              </button>
              <button
                onClick={() => onMarkAttendance(student.id, 'absent')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 shadow-sm"
              >
                <XCircle size={18} />
                <span className="hidden sm:inline">Absent</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MarkAttendance;
