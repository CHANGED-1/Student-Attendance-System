import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Calendar, Users, CheckCircle, XCircle, Search, Plus, Trash2, Edit, BarChart3 } from 'lucide-react';
import Header from './components/Header.jsx';
import TabNavigation from './components/TabNavigation.jsx';
import SearchBar from './components/SearchBar.jsx';
import MarkAttendance from './components/MarkAttendance.jsx';
import ViewRecords from './components/ViewRecords.jsx';
import ManageStudents from './components/ManageStudents.jsx';
import Reports from './components/Reports.jsx';
import Toast from './components/Toast.jsx';
import apiService from './services/api.js';


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App






// ============================================
// MAIN APP COMPONENT
// ============================================
export default function AttendanceApp() {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('mark');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch attendance when date or tab changes
  useEffect(() => {
    if (activeTab === 'view' || activeTab === 'mark') {
      fetchAttendance();
    }
  }, [selectedDate, activeTab]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const result = await apiService.getStudents();
      if (result.success) {
        setStudents(result.data || []);
      } else {
        showToast('Failed to fetch students', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server', 'error');
      // Set demo data for testing
      setStudents([
        { id: 1, name: 'John Doe', roll_number: 'CS101', class: 'Computer Science A' },
        { id: 2, name: 'Jane Smith', roll_number: 'CS102', class: 'Computer Science A' },
        { id: 3, name: 'Mike Johnson', roll_number: 'CS103', class: 'Computer Science B' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const result = await apiService.getAttendanceByDate(selectedDate);
      if (result.success) {
        setAttendanceRecords(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleMarkAttendance = async (studentId, status) => {
    try {
      const result = await apiService.markAttendance({
        student_id: studentId,
        date: selectedDate,
        status: status
      });
      
      if (result.success) {
        showToast(`Attendance marked as ${status}`, 'success');
        fetchAttendance();
      } else {
        showToast(result.message || 'Failed to mark attendance', 'error');
      }
    } catch (error) {
      showToast('Error marking attendance', 'error');
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      const result = await apiService.addStudent(studentData);
      if (result.success) {
        showToast('Student added successfully!', 'success');
        fetchStudents();
      } else {
        showToast(result.message || 'Failed to add student', 'error');
      }
    } catch (error) {
      showToast('Error adding student', 'error');
    }
  };

  const handleEditStudent = async (studentData) => {
    try {
      const result = await apiService.updateStudent(studentData);
      if (result.success) {
        showToast('Student updated successfully!', 'success');
        fetchStudents();
      } else {
        showToast(result.message || 'Failed to update student', 'error');
      }
    } catch (error) {
      showToast('Error updating student', 'error');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      const result = await apiService.deleteStudent(studentId);
      if (result.success) {
        showToast('Student deleted successfully!', 'success');
        fetchStudents();
      } else {
        showToast(result.message || 'Failed to delete student', 'error');
      }
    } catch (error) {
      showToast('Error deleting student', 'error');
    }
  };

  const handleGetStats = async (studentId, startDate, endDate) => {
    try {
      return await apiService.getAttendanceStats(studentId, startDate, endDate);
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6">
            {(activeTab === 'mark' || activeTab === 'view') && (
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            )}

            {activeTab === 'students' && (
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {activeTab === 'mark' && (
              <MarkAttendance
                students={students}
                selectedDate={selectedDate}
                onMarkAttendance={handleMarkAttendance}
                searchTerm={searchTerm}
              />
            )}

            {activeTab === 'view' && (
              <ViewRecords
                students={students}
                attendanceRecords={attendanceRecords}
                searchTerm={searchTerm}
              />
            )}

            {activeTab === 'students' && (
              <ManageStudents
                students={students}
                onAddStudent={handleAddStudent}
                onEditStudent={handleEditStudent}
                onDeleteStudent={handleDeleteStudent}
                searchTerm={searchTerm}
              />
            )}

            {activeTab === 'reports' && (
              <Reports
                students={students}
                onGetStats={handleGetStats}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
