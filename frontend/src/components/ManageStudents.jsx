import React, { useState } from 'react';
import { Plus, Trash2, Edit, Users } from 'lucide-react';   


// ============================================
// COMPONENTS - ManageStudents.jsx
// ============================================
const ManageStudents = ({ students, onAddStudent, onEditStudent, onDeleteStudent, searchTerm }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', rollNumber: '', class: '' });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.name || !formData.rollNumber || !formData.class) {
      alert('Please fill all fields');
      return;
    }

    if (editingStudent) {
      onEditStudent({ ...formData, id: editingStudent.id });
      setEditingStudent(null);
    } else {
      onAddStudent(formData);
    }
    
    setFormData({ name: '', rollNumber: '', class: '' });
    setShowAddForm(false);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      rollNumber: student.roll_number,
      class: student.class
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingStudent(null);
    setFormData({ name: '', rollNumber: '', class: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Student List ({students.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Student Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Roll Number"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Class"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              {editingStudent ? 'Update' : 'Add'} Student
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Students List */}
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
                  onClick={() => handleEdit(student)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                  title="Edit student"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
                      onDeleteStudent(student.id);
                    }
                  }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                  title="Delete student"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ManageStudents;