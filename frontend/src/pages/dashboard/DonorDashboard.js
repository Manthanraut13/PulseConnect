import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FiDroplet, FiMapPin, FiClock, FiPlus, FiCheckCircle, 
  FiXCircle, FiBell, FiActivity, FiHeart, FiCalendar 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const DonorDashboard = () => {
  const { user, updateAvailability, addNotification } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    patientName: '',
    bloodGroup: '',
    units: 1,
    urgency: 'medium',
    hospital: '',
    location: '',
    contactPhone: '',
    notes: ''
  });

  const [requests, setRequests] = useState([
    { 
      id: 1, 
      patientName: 'John Smith', 
      bloodGroup: 'A+', 
      units: 2, 
      urgency: 'critical', 
      status: 'open', 
      location: 'New York Hospital', 
      hospital: 'City General',
      contactPhone: '+1 (555) 123-4567',
      createdAt: '2024-01-15 10:30',
      donorResponse: null,
      matchScore: 95
    },
    { 
      id: 2, 
      patientName: 'Sarah Johnson', 
      bloodGroup: 'O-', 
      units: 3, 
      urgency: 'high', 
      status: 'assigned', 
      location: 'Brooklyn Medical', 
      hospital: 'Memorial Hospital',
      contactPhone: '+1 (555) 987-6543',
      createdAt: '2024-01-14 14:20',
      donorResponse: 'accepted',
      matchScore: 100
    },
    { 
      id: 3, 
      patientName: 'Mike Wilson', 
      bloodGroup: 'B+', 
      units: 1, 
      urgency: 'medium', 
      status: 'open', 
      location: 'Queens Clinic', 
      hospital: 'Queens Medical',
      contactPhone: '+1 (555) 456-7890',
      createdAt: '2024-01-13 09:15',
      donorResponse: null,
      matchScore: 85
    },
    { 
      id: 4, 
      patientName: 'Emma Davis', 
      bloodGroup: 'O+', 
      units: 2, 
      urgency: 'low', 
      status: 'open', 
      location: 'Manhattan Medical', 
      hospital: 'Manhattan General',
      contactPhone: '+1 (555) 789-0123',
      createdAt: '2024-01-12 16:45',
      donorResponse: 'rejected',
      matchScore: 90
    }
  ]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800', icon: '🟢' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', icon: '🟠' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', icon: '🔴' }
  ];

  const [stats, setStats] = useState({
    totalRequests: 12,
    yourMatches: 3,
    accepted: 1,
    rejected: 1,
    pending: 1
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newRequest = {
          id: requests.length + 1,
          patientName: ['David Brown', 'Lisa Taylor', 'Robert Clark'][Math.floor(Math.random() * 3)],
          bloodGroup: ['A+', 'B+', 'O+'][Math.floor(Math.random() * 3)],
          units: Math.floor(Math.random() * 3) + 1,
          urgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          status: 'open',
          location: 'New Emergency',
          hospital: 'Emergency Center',
          contactPhone: '+1 (555) 000-0000',
          createdAt: new Date().toLocaleString(),
          donorResponse: null,
          matchScore: Math.floor(Math.random() * 30) + 70
        };
        
        setRequests(prev => [newRequest, ...prev]);
        setStats(prev => ({ ...prev, totalRequests: prev.totalRequests + 1, yourMatches: prev.yourMatches + 1 }));
        
        addNotification({
          id: Date.now(),
          type: 'info',
          message: `New blood request from ${newRequest.patientName}`,
          time: 'Just now'
        });
        
        toast.info(`New blood request available!`);
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [requests.length, addNotification]);

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const newReq = {
      id: requests.length + 1,
      ...newRequest,
      status: 'open',
      createdAt: new Date().toLocaleString(),
      matchScore: 95
    };
    setRequests([newReq, ...requests]);
    setShowRequestForm(false);
    setNewRequest({
      patientName: '',
      bloodGroup: '',
      units: 1,
      urgency: 'medium',
      hospital: '',
      location: '',
      contactPhone: '',
      notes: ''
    });
    
    addNotification({
      id: Date.now(),
      type: 'success',
      message: 'Blood request created successfully',
      time: 'Just now'
    });
    
    toast.success('Blood request created! Hospitals will be notified.');
  };

  const handleDonorResponse = (requestId, response) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, donorResponse: response } : req
    ));
    
    const request = requests.find(r => r.id === requestId);
    const responseText = response === 'accepted' ? 'accepted' : 'rejected';
    
    addNotification({
      id: Date.now(),
      type: response === 'accepted' ? 'success' : 'warning',
      message: `You ${responseText} request from ${request?.patientName}`,
      time: 'Just now'
    });
    
    toast.success(`Request ${responseText}! ${response === 'accepted' ? 'Thank you for helping!' : ''}`);
    
    // Update stats
    if (response === 'accepted') {
      setStats(prev => ({ ...prev, accepted: prev.accepted + 1, pending: prev.pending - 1 }));
    } else {
      setStats(prev => ({ ...prev, rejected: prev.rejected + 1, pending: prev.pending - 1 }));
    }
  };

  const toggleAvailability = () => {
    const newStatus = !user.isAvailable;
    updateAvailability(newStatus);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Live Status */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Live
              </span>
            </div>
            <p className="text-gray-600">
              Welcome back, <span className="font-semibold">{user?.name}</span>! Ready to save lives.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                user?.isAvailable
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {user?.isAvailable ? (
                <>
                  <FiCheckCircle />
                  <span>Available for Donation</span>
                </>
              ) : (
                <>
                  <FiXCircle />
                  <span>Not Available</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowRequestForm(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            >
              <FiPlus />
              <span>Create Request</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Blood Group</p>
                <p className="text-2xl font-bold text-red-600">{user?.bloodGroup}</p>
              </div>
              <FiDroplet className="h-8 w-8 text-red-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Universal donor</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'open').length}</p>
              </div>
              <FiBell className="h-8 w-8 text-blue-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Near your location</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Responses</p>
                <p className="text-2xl font-bold">{stats.accepted + stats.rejected}</p>
              </div>
              <FiActivity className="h-8 w-8 text-green-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">{stats.accepted} accepted, {stats.rejected} rejected</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lives Saved</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <FiHeart className="h-8 w-8 text-purple-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Last donation: 10 days ago</div>
          </div>
        </div>
      </div>

      {/* Create Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create Blood Request</h2>
                  <p className="text-gray-600">Fill in patient details to request blood</p>
                </div>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRequest.patientName}
                      onChange={(e) => setNewRequest({...newRequest, patientName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group *
                    </label>
                    <select
                      required
                      value={newRequest.bloodGroup}
                      onChange={(e) => setNewRequest({...newRequest, bloodGroup: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select blood group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Units Required *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        required
                        value={newRequest.units}
                        onChange={(e) => setNewRequest({...newRequest, units: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span className="absolute right-3 top-2 text-gray-500">units</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Urgency Level
                    </label>
                    <select
                      value={newRequest.urgency}
                      onChange={(e) => setNewRequest({...newRequest, urgency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {urgencyLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.icon} {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    value={newRequest.hospital}
                    onChange={(e) => setNewRequest({...newRequest, hospital: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter hospital name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newRequest.location}
                    onChange={(e) => setNewRequest({...newRequest, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter exact location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={newRequest.contactPhone}
                    onChange={(e) => setNewRequest({...newRequest, contactPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={newRequest.notes}
                    onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
                    placeholder="Any additional information about the patient..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Blood Requests Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Blood Requests Near You</h2>
              <p className="text-gray-600">These patients need your help</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {requests.filter(r => r.status === 'open').length} open requests
              </span>
              <button
                onClick={() => {
                  setRequests([...requests]);
                  toast.success('Requests refreshed!');
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
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
              <p className="text-gray-600">No active blood requests in your area.</p>
              <button
                onClick={() => setShowRequestForm(true)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Create First Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const urgency = urgencyLevels.find(u => u.value === request.urgency);
                const isYourMatch = request.bloodGroup === user?.bloodGroup;
                
                return (
                  <div key={request.id} className={`border rounded-xl p-4 hover:shadow-md transition-all ${isYourMatch ? 'border-red-200 bg-red-50' : ''}`}>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-3">
                          <h3 className="font-bold text-lg text-gray-900">{request.patientName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgency?.color}`}>
                            {urgency?.icon} {urgency?.label}
                          </span>
                          {isYourMatch && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center">
                              <FiDroplet className="h-3 w-3 mr-1" />
                              Your Blood Match
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getMatchScoreColor(request.matchScore)}`}>
                            Match: {request.matchScore}%
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Blood Group</p>
                            <p className="font-bold text-lg">{request.bloodGroup}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Units Required</p>
                            <p className="font-semibold">{request.units} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-semibold">{request.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Hospital</p>
                            <p className="font-semibold">{request.hospital}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>📞 {request.contactPhone}</span>
                            <span>🕐 {request.createdAt}</span>
                          </div>
                          {request.notes && (
                            <p className="mt-2 p-2 bg-gray-50 rounded">{request.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-3">
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            request.status === 'open' ? 'bg-green-100 text-green-800' :
                            request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status}
                          </span>
                          {request.donorResponse && (
                            <div className={`mt-2 px-2 py-1 rounded text-xs ${
                              request.donorResponse === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              You {request.donorResponse} this request
                            </div>
                          )}
                        </div>
                        
                        {request.status === 'open' && !request.donorResponse && isYourMatch && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDonorResponse(request.id, 'reject')}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center space-x-2"
                            >
                              <FiXCircle />
                              <span>Reject</span>
                            </button>
                            <button
                              onClick={() => handleDonorResponse(request.id, 'accept')}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center space-x-2 shadow-lg"
                            >
                              <FiCheckCircle />
                              <span>Accept Request</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800 font-medium">System Status</p>
              <p className="text-lg font-bold text-red-900">All Systems Operational</p>
            </div>
            <div className="h-10 w-10 bg-red-200 rounded-full flex items-center justify-center">
              <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Last Donation</p>
              <p className="text-lg font-bold text-blue-900">10 days ago</p>
            </div>
            <FiCalendar className="h-8 w-8 text-blue-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 font-medium">Next Eligible</p>
              <p className="text-lg font-bold text-green-900">In 2 days</p>
            </div>
            <FiClock className="h-8 w-8 text-green-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;