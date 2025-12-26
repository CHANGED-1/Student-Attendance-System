import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';


// ============================================
// COMPONENTS - Reports.jsx
// ============================================
const Reports = ({ students, onGetStats }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedStudent || !startDate || !endDate) {
      alert('Please select student and date range');
      return;
    }

    setLoading(true);
    try {
      const result = await onGetStats(selectedStudent, startDate, endDate);
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const attendancePercentage = stats 
    ? ((stats.present_days / stats.total_days) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Attendance Reports</h2>

      {/* Report Filters */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select Student --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.roll_number})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <BarChart3 size={20} />
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Report Results */}
      {stats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-semibold">Total Days</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total_days}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-semibold">Present Days</p>
              <p className="text-2xl font-bold text-green-700">{stats.present_days}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-semibold">Absent Days</p>
              <p className="text-2xl font-bold text-red-700">{stats.absent_days}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-semibold">Attendance %</p>
              <p className="text-2xl font-bold text-purple-700">{attendancePercentage}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Attendance Progress</span>
              <span>{attendancePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  attendancePercentage >= 75 ? 'bg-green-500' :
                  attendancePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Reports;