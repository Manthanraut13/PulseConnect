import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUser, FiLogOut, FiDroplet, FiCalendar, FiBarChart2 } from 'react-icons/fi';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleIcon = () => {
    switch(user?.role) {
      case 'donor': return <FiUser className="h-5 w-5" />;
      case 'blood-bank': return <FiDroplet className="h-5 w-5" />;
      case 'ngo': return <FiCalendar className="h-5 w-5" />;
      case 'admin': return <FiBarChart2 className="h-5 w-5" />;
      default: return <FiUser className="h-5 w-5" />;
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              {getRoleIcon()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-red-600">
              <FiHome className="h-5 w-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;