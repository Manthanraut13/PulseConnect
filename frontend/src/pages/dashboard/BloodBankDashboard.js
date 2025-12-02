import React, { useState, useEffect } from 'react';
import { FiDroplet, FiPackage, FiCheckCircle, FiXCircle, FiPlus, FiMinus, FiBell, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BloodBankDashboard = () => {
  const [inventory, setInventory] = useState({
    'A+': 15, 'A-': 8,
    'B+': 12, 'B-': 6,
    'O+': 25, 'O-': 10,
    'AB+': 7, 'AB-': 4
  });

  const [requests, setRequests] = useState([
    { 
      id: 1, 
      patientName: 'John Smith', 
      bloodGroup: 'A+', 
      units: 2, 
      urgency: 'critical', 
      status: 'pending', 
      hospital: 'City General',
      contact: '+1 (555) 123-4567',
      requestedAt: '10:30 AM',
      distance: '2.3 km',
      bloodBankResponse: null
    },
    { 
      id: 2, 
      patientName: 'Sarah Johnson', 
      bloodGroup: 'O-', 
      units: 3, 
      urgency: 'high', 
      status: 'accepted', 
      hospital: 'Memorial Hospital',
      contact: '+1 (555) 987-6543',
      requestedAt: '9:15 AM',
      distance: '5.1 km',
      bloodBankResponse: 'accepted'
    },
    { 
      id: 3, 
      patientName: 'Mike Wilson', 
      bloodGroup: 'B+', 
      units: 1, 
      urgency: 'medium', 
      status: 'rejected', 
      hospital: 'Queens Medical',
      contact: '+1 (555) 456-7890',
      requestedAt: 'Yesterday',
      distance: '8.7 km',
      bloodBankResponse: 'rejected'
    },
    { 
      id: 4, 
      patientName: 'Emma Davis', 
      bloodGroup: 'AB+', 
      units: 2, 
      urgency: 'low', 
      status: 'pending', 
      hospital: 'Manhattan General',
      contact: '+1 (555) 789-0123',
      requestedAt: 'Just now',
      distance: '1.5 km',
      bloodBankResponse: null
    }
  ]);

  const [stats, setStats] = useState({
    totalRequests: 24,
    accepted: 18,
    rejected: 4,
    pending: 2,
    fulfillmentRate: 85
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  useEffect(() => {
    // Simulate new requests
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && requests.filter(r => r.status === 'pending').length < 5) {
        const newRequest = {
          id: requests.length + 1,
          patientName: ['David Lee', 'Maria Garcia', 'James Wilson'][Math.floor(Math.random() * 3)],
          bloodGroup: bloodGroups[Math.floor(Math.random() * 8)],
          units: Math.floor(Math.random() * 3) + 1,
          urgency: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          status: 'pending',
          hospital: ['Emergency Center', 'City Hospital', 'Community Clinic'][Math.floor(Math.random() * 3)],
          contact: '+1 (555) 000-0000',
          requestedAt: 'Just now',
          distance: (Math.random() * 10).toFixed(1) + ' km',
          bloodBankResponse: null
        };
        
        setRequests(prev => [newRequest, ...prev]);
        setStats(prev => ({ 
          ...prev, 
          totalRequests: prev.totalRequests + 1,
          pending: prev.pending + 1
        }));
        
        toast.info(`New blood request from ${newRequest.patientName}`);
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [requests.length]);

  const updateInventory = (bloodGroup, action) => {
    const newValue = action === 'increase' 
      ? inventory[bloodGroup] + 1 
      : Math.max(0, inventory[bloodGroup] - 1);
    
    setInventory(prev => ({
      ...prev,
      [bloodGroup]: newValue
    }));
    
    toast.success(`Inventory ${action === 'increase' ? 'increased' : 'decreased'} for ${bloodGroup}`);
  };

  const handleRequestResponse = (requestId, response) => {
    const request = requests.find(r => r.id === requestId);
    const bloodGroup = request?.bloodGroup;
    const units = request?.units || 1;
    
    if (response === 'accepted') {
      // Check inventory
      if (inventory[bloodGroup] < units) {
        toast.error(`Not enough ${bloodGroup} in inventory!`);
        return;
      }
      
      // Update inventory
      setInventory(prev => ({
        ...prev,
        [bloodGroup]: prev[bloodGroup] - units
      }));
    }
    
    // Update request status
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { 
        ...req, 
        status: response,
        bloodBankResponse: response
      } : req
    ));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      [response === 'accepted' ? 'accepted' : 'rejected']: prev[response === 'accepted' ? 'accepted' : 'rejected'] + 1,
      pending: prev.pending - 1,
      fulfillmentRate: Math.round(((prev.accepted + (response === 'accepted' ? 1 : 0)) / (prev.totalRequests + 1)) * 100)
    }));
    
    toast.success(`Request ${response}! ${response === 'accepted' ? 'Inventory updated.' : ''}`);
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalUnits = Object.values(inventory).reduce((a, b) => a + b, 0);
  const criticalLow = bloodGroups.filter(bg => inventory[bg] < 5).length;
  const warningLow = bloodGroups.filter(bg => inventory[bg] >= 5 && inventory[bg] < 10).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Blood Bank Dashboard</h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
                Processing
              </span>
            </div>
            <p className="text-gray-600">Manage blood inventory and respond to requests in real-time</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Fulfillment Rate</p>
              <p className="text-2xl font-bold text-green-600">{stats.fulfillmentRate}%</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <FiTrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Blood Units</p>
                <p className="text-2xl font-bold">{totalUnits}</p>
              </div>
              <FiPackage className="h-8 w-8 text-blue-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {criticalLow > 0 && <span className="text-red-600">{criticalLow} critical low</span>}
              {warningLow > 0 && <span className="text-yellow-600 ml-2">{warningLow} warning low</span>}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <FiBell className="h-8 w-8 text-yellow-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Need your response</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <FiCheckCircle className="h-8 w-8 text-green-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Requests fulfilled</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected Today</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <FiXCircle className="h-8 w-8 text-red-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Not available</div>
          </div>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Blood Inventory Management</h2>
            <p className="text-gray-600">Update stock levels in real-time</p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bloodGroups.map((group) => {
            const count = inventory[group];
            const isCritical = count < 5;
            const isWarning = count >= 5 && count < 10;
            
            return (
              <div key={group} className={`border rounded-xl p-4 ${isCritical ? 'border-red-200 bg-red-50' : isWarning ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="text-2xl font-bold">{group}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${isCritical ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {count}
                    </p>
                    <p className="text-sm text-gray-600">units</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateInventory(group, 'increase')}
                    className="flex-1 bg-green-100 text-green-700 hover:bg-green-200 py-2 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FiPlus />
                  </button>
                  <button
                    onClick={() => updateInventory(group, 'decrease')}
                    disabled={count === 0}
                    className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 py-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <FiMinus />
                  </button>
                </div>
                
                {isCritical && (
                  <div className="mt-3 flex items-center text-xs text-red-600">
                    <FiAlertCircle className="h-3 w-3 mr-1" />
                    Critical low stock
                  </div>
                )}
                {isWarning && (
                  <div className="mt-3 text-xs text-yellow-600">⚠️ Low stock warning</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Blood Units Available</p>
              <p className="text-2xl font-bold">{totalUnits}</p>
            </div>
            <div className="text-sm">
              <span className={`px-2 py-1 rounded-full ${criticalLow > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {criticalLow > 0 ? `${criticalLow} groups critical` : 'All stocks sufficient'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Blood Requests Management */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Blood Requests Management</h2>
              <p className="text-gray-600">Accept or reject incoming blood requests</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {requests.filter(r => r.status === 'pending').length} pending requests
              </span>
              <button
                onClick={() => {
                  setRequests([...requests]);
                  toast.success('Requests refreshed!');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <FiDroplet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No blood requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-xl p-4 hover:shadow-md transition-all">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{request.patientName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                        {request.bloodBankResponse && (
                          <span className={`px-2 py-1 rounded text-xs ${
                            request.bloodBankResponse === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            You {request.bloodBankResponse} this request
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Blood Group</p>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg">{request.bloodGroup}</span>
                            <span className={`text-xs px-1 py-0.5 rounded ${
                              inventory[request.bloodGroup] >= request.units 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              Stock: {inventory[request.bloodGroup]}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Units Required</p>
                          <p className="font-semibold">{request.units} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hospital</p>
                          <p className="font-semibold">{request.hospital}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Distance</p>
                          <p className="font-semibold">{request.distance}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>📞 {request.contact}</span>
                          <span>🕐 Requested {request.requestedAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleRequestResponse(request.id, 'reject')}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center justify-center space-x-2"
                        >
                          <FiXCircle />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleRequestResponse(request.id, 'accepted')}
                          disabled={inventory[request.bloodGroup] < request.units}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                        >
                          <FiCheckCircle />
                          <span>Accept & Dispatch</span>
                        </button>
                      </div>
                    )}
                    
                    {request.status !== 'pending' && (
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status.toUpperCase()}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {request.bloodBankResponse === 'accepted' ? 'Inventory updated' : 'Request declined'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Alerts */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800 font-medium">System Alert</p>
              <p className="text-lg font-bold text-red-900">
                {criticalLow > 0 
                  ? `${criticalLow} blood groups critical` 
                  : 'All stocks operational'}
              </p>
            </div>
            {criticalLow > 0 ? (
              <div className="h-10 w-10 bg-red-200 rounded-full flex items-center justify-center animate-pulse">
                <FiAlertCircle className="h-5 w-5 text-red-600" />
              </div>
            ) : (
              <div className="h-10 w-10 bg-green-200 rounded-full flex items-center justify-center">
                <FiCheckCircle className="h-5 w-5 text-green-600" />
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Response Time</p>
              <p className="text-lg font-bold text-blue-900">Average: 12 minutes</p>
            </div>
            <FiTrendingUp className="h-8 w-8 text-blue-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodBankDashboard;