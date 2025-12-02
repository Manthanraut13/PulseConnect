import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiDroplet, FiBell, FiUser, FiLogOut } from 'react-icons/fi';

const MainLayout = () => {
  const { user, logout, notifications } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <FiDroplet className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PulseConnect</h1>
                <p className="text-xs text-red-600 font-medium">Live Blood Management System</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 text-gray-600 hover:text-red-600 relative"
                    >
                      <FiBell className="h-5 w-5" />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                    </button>
                    
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                        <div className="p-3 border-b">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Notifications</h3>
                            <span className="text-xs text-red-600">{notifications.length} new</span>
                          </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.slice(0, 5).map((notif) => (
                            <div key={notif.id} className="p-3 border-b hover:bg-gray-50">
                              <div className="flex items-start">
                                <div className={`h-2 w-2 rounded-full mt-1 mr-2 ${
                                  notif.type === 'success' ? 'bg-green-500' :
                                  notif.type === 'warning' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`}></div>
                                <div className="flex-1">
                                  <p className="text-sm">{notif.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-2 border-t">
                          <button className="w-full text-center text-sm text-red-600 hover:text-red-700 py-1">
                            View All
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* User Profile */}
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                      <FiUser className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/dashboard/${user.role}`}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 text-sm"
                  >
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-red-600 px-3 py-2">
                    Login
                  </Link>
                  <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* System Status Bar */}
      {user && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-b">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  System: <span className="font-medium ml-1">Operational</span>
                </span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="text-green-700 font-medium">
                Welcome to PulseConnect Dashboard
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">PulseConnect</h3>
              <p className="text-gray-400 text-sm">
                Smart Blood Donation & Management Platform. 
                Connecting donors, blood banks, and recipients in real-time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect Us</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-gray-400">pulseconnect@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-gray-400">Instagram</span>
                </div>
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-gray-400">WhatsApp</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">All Right Resevered</h3>
              <p className="text-gray-400 text-sm">
                All the rights are reserved by PulseConnect.Pvt
              </p>
            </div>
          </div>
          {/* <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© 2024 LifeLink Demo System. Made for demonstration purposes.</p>
          </div> */}
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;