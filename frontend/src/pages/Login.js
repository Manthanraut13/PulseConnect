import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiDroplet, FiUsers, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(email, password, navigate);
    
    if (!result.success) {
      toast.error('Login failed. Use demo credentials.');
    }
    
    setIsLoading(false);
  };

  const roleCards = [
    {
      title: 'Donor Login',
      description: 'Create blood requests, update availability',
      icon: <FiUser className="h-8 w-8" />,
      color: 'bg-red-100 text-red-600',
      credentials: { email: 'donor@demo.com', password: 'password' }
    },
    {
      title: 'Blood Bank Login',
      description: 'Manage inventory, accept/reject requests',
      icon: <FiDroplet className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-600',
      credentials: { email: 'bloodbank@demo.com', password: 'password' }
    },
    {
      title: 'NGO Login',
      description: 'Organize camps, manage volunteers',
      icon: <FiUsers className="h-8 w-8" />,
      color: 'bg-green-100 text-green-600',
      credentials: { email: 'ngo@demo.com', password: 'password' }
    },
    {
      title: 'Admin Login',
      description: 'Monitor system, manage users',
      icon: <FiShield className="h-8 w-8" />,
      color: 'bg-purple-100 text-purple-600',
      credentials: { email: 'admin@demo.com', password: 'password' }
    },
    {
      title: 'Beneficiary Login',
      description: 'Request blood for patients',
      icon: <FiUser className="h-8 w-8" />,
      color: 'bg-purple-100 text-purple-600',
      credentials: { email: 'beneficiary@demo.com', password: 'password' }
    }
  ];

  const handleQuickLogin = (credentials) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
    toast.success(`Logging in as ${credentials.email.split('@')[0]}...`);
    setTimeout(() => {
      login(credentials.email, credentials.password, navigate);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to PulseConnect</h1>
          <p className="text-gray-600 text-lg">Smart Blood Donation & Management Platform</p>
          {/* <div className="inline-flex items-center mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            Live Demo - All Features Active
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiMail className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Login to Dashboard</h2>
                <p className="text-gray-600">Enter your credentials to continue</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Create New Account
                </button>
              </p>
            </div>
          </div>

          {/* Quick Login Cards */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center lg:text-left">
              Quick Login
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roleCards.map((role, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLogin(role.credentials)}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-transparent hover:border-red-200 text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${role.color} group-hover:scale-110 transition-transform`}>
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{role.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                      <div className="mt-3">
                        {/* <div className="text-xs text-gray-500">Email: {role.credentials.email}</div> */}
                        {/* <div className="text-xs text-gray-500">Password: {role.credentials.password}</div> */}
                      </div>
                    </div>
                    <div className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                      Click to Login
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Demo Notice */}
            {/* <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Live Demo:</strong> All features are fully functional. Try accepting/rejecting requests, managing inventory, and creating camps.
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">System Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">Online</div>
              <div className="text-sm text-gray-600">Backend API</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">Active</div>
              <div className="text-sm text-gray-600">Database</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">4</div>
              <div className="text-sm text-gray-600">Active Roles</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">Live</div>
              <div className="text-sm text-gray-600">Real-time Updates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;