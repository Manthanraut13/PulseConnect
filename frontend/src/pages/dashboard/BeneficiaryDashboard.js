import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FiDroplet, FiPlus, FiClock, FiCheckCircle, 
  FiUsers, FiMapPin, FiAlertCircle, FiActivity 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const BeneficiaryDashboard = () => {
  const { user, bloodRequests, createBloodRequest } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    patientName: '',
    bloodGroup: '',
    units: 1,
    urgency: 'critical',
    location: '',
    hospital: '',
    contactPhone: '',
    notes: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800', icon: '🟢' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', icon: '🟠' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', icon: '🔴' }
  ];

  // Filter requests created by this beneficiary
  const myRequests = bloodRequests.filter(req => req.beneficiaryId === user?.id);

  const handleCreateRequest = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to create requests');
      return;
    }

    const requestData = {
      patientName: newRequest.patientName,
      bloodGroup: newRequest.bloodGroup,
      units: parseInt(newRequest.units),
      urgency: newRequest.urgency,
      location: newRequest.location,
      hospital: newRequest.hospital,
      contactPhone: newRequest.contactPhone,
      notes: newRequest.notes
    };

    createBloodRequest(requestData);
    
    setShowRequestForm(false);
    setNewRequest({
      patientName: '',
      bloodGroup: '',
      units: 1,
      urgency: 'critical',
      location: '',
      hospital: '',
      contactPhone: '',
      notes: ''
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Beneficiary Dashboard</h1>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                Patient Request System
              </span>
            </div>
            <p className="text-gray-600">
              Welcome, <span className="font-semibold">{user?.name}</span>! Create blood requests for patients in need.
            </p>
          </div>
          <button
            onClick={() => setShowRequestForm(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
          >
            <FiPlus />
            <span>Create Blood Request</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{myRequests.length}</p>
              </div>
              <FiDroplet className="h-8 w-8 text-purple-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Created by you</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {myRequests.filter(r => r.status === 'open').length}
                </p>
              </div>
              <FiClock className="h-8 w-8 text-yellow-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Awaiting response</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-green-600">
                  {myRequests.filter(r => r.status === 'assigned').length}
                </p>
              </div>
              <FiCheckCircle className="h-8 w-8 text-green-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Accepted by donors/banks</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {myRequests.length > 0 
                    ? `${Math.round((myRequests.filter(r => r.status === 'assigned').length / myRequests.length) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
              <FiActivity className="h-8 w-8 text-blue-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Average acceptance</div>
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
                  <h2 className="text-2xl font-bold text-gray-900">Request Blood for Patient</h2>
                  <p className="text-gray-600">This request will be sent to nearby donors and blood banks</p>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group Required *
                    </label>
                    <select
                      required
                      value={newRequest.bloodGroup}
                      onChange={(e) => setNewRequest({...newRequest, bloodGroup: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="absolute right-3 top-2 text-gray-500">units</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Urgency Level *
                    </label>
                    <select
                      required
                      value={newRequest.urgency}
                      onChange={(e) => setNewRequest({...newRequest, urgency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRequest.hospital}
                    onChange={(e) => setNewRequest({...newRequest, hospital: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter hospital name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRequest.location}
                    onChange={(e) => setNewRequest({...newRequest, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter exact location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newRequest.contactPhone}
                    onChange={(e) => setNewRequest({...newRequest, contactPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                    placeholder="Any additional information about the patient's condition..."
                  />
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FiAlertCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">Request Notification</p>
                      <p className="text-sm text-purple-700 mt-1">
                        This request will be immediately sent to:
                        <span className="block mt-1">• Nearby available donors matching the blood group</span>
                        <span className="block">• Nearby blood banks with available stock</span>
                        <span className="block font-semibold mt-2">The first to accept will be assigned!</span>
                      </p>
                    </div>
                  </div>
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
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-lg"
                  >
                    Send Request to Donors & Blood Banks
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* My Requests Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Blood Requests</h2>
              <p className="text-gray-600">Track all your blood requests and responses</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {myRequests.filter(r => r.status === 'open').length} pending
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {myRequests.length === 0 ? (
            <div className="text-center py-12">
              <FiDroplet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">You haven't created any blood requests yet.</p>
              <button
                onClick={() => setShowRequestForm(true)}
                className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800"
              >
                Create Your First Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div key={request.id} className="border rounded-xl p-4 hover:shadow-md transition-all">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <h3 className="font-bold text-lg text-gray-900">
                          Request #{request.id}: {request.patientName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.toUpperCase()}
                        </span>
                        {request.assignedTo && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            ✓ Assigned to: {request.acceptedBy}
                          </span>
                        )}
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
                          <p className="text-sm text-gray-600">Hospital</p>
                          <p className="font-semibold">{request.hospital}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requested</p>
                          <p className="font-semibold">{request.createdAt}</p>
                        </div>
                      </div>
                      
                      {/* Donor Responses */}
                      {request.donorResponses.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-2">Donor Responses:</p>
                          <div className="space-y-2">
                            {request.donorResponses.map((response, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{response.donorName}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  response.response === 'accepted' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {response.response.toUpperCase()} at {response.time}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Blood Bank Responses */}
                      {request.bloodBankResponses.length > 0 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-900 mb-2">Blood Bank Responses:</p>
                          <div className="space-y-2">
                            {request.bloodBankResponses.map((response, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{response.bloodBankName}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  response.response === 'accepted' ? 'bg-green-100 text-green-800' :
                                  response.response === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {response.response.toUpperCase()} {response.time ? `at ${response.time}` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {request.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDashboard;