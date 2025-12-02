import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'System initialized successfully', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New blood request from John Smith', time: '5 min ago' },
    { id: 3, type: 'warning', message: 'Blood group O- running low', time: '10 min ago' }
  ]);

  // Enhanced demo users with Beneficiary role
  const demoUsers = {
    'beneficiary@demo.com': { 
      id: '1', 
      name: 'Patient John', 
      role: 'beneficiary', 
      location: { city: 'New York', state: 'NY' },
      phone: '+1 (555) 111-2222',
      emergencyContact: '+1 (555) 333-4444'
    },
    'donor@demo.com': { 
      id: '2', 
      name: 'Alex Johnson', 
      role: 'donor', 
      bloodGroup: 'O+', 
      isAvailable: true,
      location: { city: 'New York', state: 'NY' },
      totalDonations: 5,
      lastDonation: '2024-01-10',
      phone: '+1 (555) 123-4567'
    },
    'bloodbank@demo.com': { 
      id: '3', 
      name: 'City Blood Bank', 
      role: 'blood-bank',
      location: { city: 'New York', state: 'NY' },
      phone: '+1 (555) 987-6543',
      license: 'BB-2024-001',
      rating: 4.8
    },
    'ngo@demo.com': { 
      id: '4', 
      name: 'LifeSave NGO', 
      role: 'ngo',
      location: { city: 'New York', state: 'NY' },
      phone: '+1 (555) 456-7890',
      registration: 'NGO-2024-001',
      totalCamps: 15
    },
    'admin@demo.com': { 
      id: '5', 
      name: 'System Administrator', 
      role: 'admin',
      location: { city: 'New York', state: 'NY' },
      permissions: ['all'],
      lastLogin: new Date().toISOString()
    }
  };

  // Blood Request System State
  const [bloodRequests, setBloodRequests] = useState([
    {
      id: 'REQ001',
      beneficiaryId: '1',
      beneficiaryName: 'Patient John',
      patientName: 'Sarah Johnson',
      bloodGroup: 'O+',
      units: 2,
      urgency: 'critical',
      location: 'New York Hospital',
      hospital: 'City General',
      contactPhone: '+1 (555) 111-2222',
      notes: 'Emergency surgery required',
      status: 'open', // open, assigned, completed, cancelled
      assignedTo: null, // donorId or bloodBankId
      assignedType: null, // 'donor' or 'blood-bank'
      createdAt: '2024-01-15 10:30',
      donorResponses: [
        { donorId: '2', donorName: 'Alex Johnson', response: 'accepted', time: '2024-01-15 10:35' }
      ],
      bloodBankResponses: [
        { bloodBankId: '3', bloodBankName: 'City Blood Bank', response: 'pending', time: null }
      ],
      acceptedBy: 'Alex Johnson',
      rejectedBy: []
    }
  ]);

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Add random notification
      const newNotification = {
        id: Date.now(),
        type: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)],
        message: ['New donor registered', 'Blood request completed', 'Inventory updated', 'Camp created'][Math.floor(Math.random() * 4)],
        time: 'Just now'
      };
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const login = async (email, password, navigateFunc) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (demoUsers[email] && password === 'password') {
      const user = demoUsers[email];
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Add login notification
      const loginNotif = {
        id: Date.now(),
        type: 'success',
        message: `Welcome back, ${user.name}!`,
        time: 'Just now'
      };
      setNotifications(prev => [loginNotif, ...prev]);
      
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on role
      if (navigateFunc) {
        navigateFunc(`/dashboard/${user.role}`);
      }
      return { success: true, user };
    } else {
      toast.error('Invalid credentials. Use demo emails.');
      return { success: false };
    }
  };

  const register = async (userData, navigateFunc) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'beneficiary',
      bloodGroup: userData.bloodGroup || '',
      location: userData.location || { city: '', state: '' },
      isAvailable: userData.role === 'donor' ? true : undefined,
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Add registration notification
    const regNotif = {
      id: Date.now(),
      type: 'success',
      message: `New ${newUser.role} registered: ${newUser.name}`,
      time: 'Just now'
    };
    setNotifications(prev => [regNotif, ...prev]);
    
    toast.success('Registration successful! Welcome to LifeLink.');
    
    // Redirect
    if (navigateFunc) {
      navigateFunc(`/dashboard/${newUser.role}`);
    }
    return { success: true, user: newUser };
  };

  const logout = (navigateFunc) => {
    // Add logout notification
    const logoutNotif = {
      id: Date.now(),
      type: 'info',
      message: `${user?.name} logged out`,
      time: 'Just now'
    };
    setNotifications(prev => [logoutNotif, ...prev]);
    
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    
    if (navigateFunc) {
      navigateFunc('/login');
    }
  };

  // Blood Request Methods
  const createBloodRequest = (requestData) => {
    const newRequest = {
      id: `REQ${String(bloodRequests.length + 1).padStart(3, '0')}`,
      beneficiaryId: user?.id,
      beneficiaryName: user?.name,
      ...requestData,
      status: 'open',
      assignedTo: null,
      assignedType: null,
      createdAt: new Date().toLocaleString(),
      donorResponses: [],
      bloodBankResponses: [],
      acceptedBy: null,
      rejectedBy: []
    };
    
    setBloodRequests(prev => [newRequest, ...prev]);
    
    // Add notification for all donors and blood banks
    const notif = {
      id: Date.now(),
      type: 'info',
      message: `New blood request from ${user?.name}`,
      time: 'Just now'
    };
    setNotifications(prev => [notif, ...prev]);
    
    toast.success('Blood request created! Donors and blood banks have been notified.');
    return newRequest;
  };

  const updateDonorResponse = (requestId, response) => {
    setBloodRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const existingResponse = req.donorResponses.find(r => r.donorId === user?.id);
        
        if (existingResponse) {
          // Update existing response
          return {
            ...req,
            donorResponses: req.donorResponses.map(r => 
              r.donorId === user?.id ? { ...r, response, time: new Date().toLocaleString() } : r
            ),
            ...(response === 'accepted' && req.status === 'open' ? {
              status: 'assigned',
              assignedTo: user?.id,
              assignedType: 'donor',
              acceptedBy: user?.name
            } : {})
          };
        } else {
          // Add new response
          const updated = {
            ...req,
            donorResponses: [
              ...req.donorResponses,
              {
                donorId: user?.id,
                donorName: user?.name,
                response,
                time: new Date().toLocaleString()
              }
            ],
            ...(response === 'accepted' && req.status === 'open' ? {
              status: 'assigned',
              assignedTo: user?.id,
              assignedType: 'donor',
              acceptedBy: user?.name
            } : {})
          };
          
          // Add to rejectedBy if rejected
          if (response === 'rejected') {
            updated.rejectedBy = [...updated.rejectedBy, user?.name];
          }
          
          return updated;
        }
      }
      return req;
    }));
    
    toast.success(`Response ${response}! ${response === 'accepted' ? 'You have been assigned to this request.' : ''}`);
  };

  const updateBloodBankResponse = (requestId, response) => {
    setBloodRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const existingResponse = req.bloodBankResponses.find(r => r.bloodBankId === user?.id);
        
        if (existingResponse) {
          // Update existing response
          return {
            ...req,
            bloodBankResponses: req.bloodBankResponses.map(r => 
              r.bloodBankId === user?.id ? { ...r, response, time: new Date().toLocaleString() } : r
            ),
            ...(response === 'accepted' && req.status === 'open' ? {
              status: 'assigned',
              assignedTo: user?.id,
              assignedType: 'blood-bank',
              acceptedBy: user?.name
            } : {})
          };
        } else {
          // Add new response
          const updated = {
            ...req,
            bloodBankResponses: [
              ...req.bloodBankResponses,
              {
                bloodBankId: user?.id,
                bloodBankName: user?.name,
                response,
                time: new Date().toLocaleString()
              }
            ],
            ...(response === 'accepted' && req.status === 'open' ? {
              status: 'assigned',
              assignedTo: user?.id,
              assignedType: 'blood-bank',
              acceptedBy: user?.name
            } : {})
          };
          
          // Add to rejectedBy if rejected
          if (response === 'rejected') {
            updated.rejectedBy = [...updated.rejectedBy, user?.name];
          }
          
          return updated;
        }
      }
      return req;
    }));
    
    toast.success(`Response ${response}! ${response === 'accepted' ? 'Your blood bank has been assigned.' : ''}`);
  };

  const updateAvailability = (isAvailable) => {
    if (user && user.role === 'donor') {
      const updatedUser = { ...user, isAvailable };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Add notification
      const notif = {
        id: Date.now(),
        type: 'info',
        message: `Donor availability updated to ${isAvailable ? 'Available' : 'Not Available'}`,
        time: 'Just now'
      };
      setNotifications(prev => [notif, ...prev]);
      
      toast.success(`You are now ${isAvailable ? 'available' : 'unavailable'} for donations`);
      return updatedUser;
    }
    return user;
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    user,
    notifications,
    bloodRequests,
    login,
    register,
    logout,
    updateAvailability,
    createBloodRequest,
    updateDonorResponse,
    updateBloodBankResponse,
    addNotification,
    clearNotifications
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};