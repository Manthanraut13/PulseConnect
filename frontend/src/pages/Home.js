import React from 'react';
import { Link } from 'react-router-dom';
import { FiDroplet } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-white p-4">
      <div className="text-center max-w-4xl">
        <div className="flex justify-center mb-8">
          <FiDroplet className="h-24 w-24 text-red-600 animate-pulse" />
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          PulseConnect
          <span className="block text-2xl text-red-600 mt-2">
            Smart Blood Donation Platform
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A demonstration platform connecting donors, blood banks, and NGOs to save lives.
          Simple, clean, and functional.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            to="/login" 
            className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Sign Up
          </Link>
        </div>
        
        {/* Demo Credentials */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Demo Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { role: 'Donor', email: 'donor@demo.com', pass: 'password' },
              { role: 'Blood Bank', email: 'bloodbank@demo.com', pass: 'password' },
              { role: 'NGO', email: 'ngo@demo.com', pass: 'password' },
              { role: 'Admin', email: 'admin@demo.com', pass: 'password' }
            ].map((cred, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-gray-900">{cred.role}</div>
                <div className="text-sm text-gray-600">Email: {cred.email}</div>
                <div className="text-sm text-gray-600">Password: {cred.pass}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Click any credential above and use "Login to Demo" button
          </p>
        </div> */}
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Donor Dashboard', desc: 'Create requests, toggle availability' },
              { title: 'Blood Bank Dashboard', desc: 'Manage inventory, accept requests' },
              { title: 'NGO Dashboard', desc: 'Organize donation camps' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* <footer className="mt-12 text-gray-500 text-sm">
        <p>LifeLink Demo Version • Made for presentation</p>
      </footer> */}
    </div>
  );
};

export default Home;