// ============================================
// SERVICES - api.js
// ============================================
const API_BASE_URL = 'http://localhost:8000/api';

const apiService = {
  async getStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/students.php`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch students');
    }
  },

  async addStudent(studentData) {
    const response = await fetch(`${API_BASE_URL}/students.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    return await response.json();
  },

  async updateStudent(studentData) {
    const response = await fetch(`${API_BASE_URL}/students.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    return await response.json();
  },

  async deleteStudent(studentId) {
    const response = await fetch(`${API_BASE_URL}/students.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: studentId })
    });
    return await response.json();
  },

  async getAttendanceByDate(date) {
    const response = await fetch(`${API_BASE_URL}/attendance.php?date=${date}`);
    return await response.json();
  },

  async markAttendance(attendanceData) {
    const response = await fetch(`${API_BASE_URL}/attendance.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendanceData)
    });
    return await response.json();
  },

  async getAttendanceStats(studentId, startDate, endDate) {
    const url = `${API_BASE_URL}/attendance.php?stats=true&student_id=${studentId}${startDate ? `&start_date=${startDate}` : ''}${endDate ? `&end_date=${endDate}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  }
};

export default apiService;