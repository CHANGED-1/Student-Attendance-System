import React from 'react';
import { Calendar, Users, CheckCircle, BarChart3 } from 'lucide-react';

// ============================================
// COMPONENTS - TabNavigation.jsx
// ============================================
const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'mark', label: 'Mark Attendance', icon: CheckCircle },
    { id: 'view', label: 'View Records', icon: Calendar },
    { id: 'students', label: 'Manage Students', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="flex border-b bg-white rounded-t-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            <Icon size={20} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;