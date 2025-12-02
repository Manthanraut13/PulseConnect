import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Context
import { AuthProvider } from './context/AuthContext';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/dashboard/DonorDashboard';
import BloodBankDashboard from './pages/dashboard/BloodBankDashboard';
import NGODashboard from './pages/dashboard/NGODashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import BeneficiaryDashboard from './pages/dashboard/BeneficiaryDashboard';

// Import Components
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Import CSS
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route path="donor" element={<DonorDashboard />} />
            <Route path="blood-bank" element={<BloodBankDashboard />} />
            <Route path="ngo" element={<NGODashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="beneficiary" element={<BeneficiaryDashboard />} />
          </Route>

          {/* Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;