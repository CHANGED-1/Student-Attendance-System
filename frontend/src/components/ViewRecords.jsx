import React from 'react';
import { CheckCircle, XCircle, Users } from 'lucide-react';


// ============================================
// COMPONENTS - ViewRecords.jsx
// ============================================
const ViewRecords = ({ students, attendanceRecords, searchTerm }) => {
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceStatus = (studentId) => {
    const record = attendanceRecords.find(r => r.student_id === studentId);
    return record ? record.status : null;
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const totalMarked = presentCount + absentCount;

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold opacity-90">Total Students</h3>
          <p className="text-3xl font-bold mt-1">{students.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold opacity-90">Present</h3>
          <p className="text-3xl font-bold mt-1">{presentCount}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold opacity-90">Absent</h3>
          <p className="text-3xl font-bold mt-1">{absentCount}</p>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No students found</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const status = getAttendanceStatus(student.id);
            return (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">
                    Roll: {student.roll_number} | Class: {student.class}
                  </p>
                </div>
                <div>
                  {status === 'present' && (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold flex items-center gap-2">
                      <CheckCircle size={18} />
                      Present
                    </span>
                  )}
                  {status === 'absent' && (
                    <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold flex items-center gap-2">
                      <XCircle size={18} />
                      Absent
                    </span>
                  )}
                  {!status && (
                    <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-semibold">
                      Not Marked
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ViewRecords;