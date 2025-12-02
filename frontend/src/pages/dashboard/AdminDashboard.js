import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUsers, FiDroplet, FiCalendar, FiBarChart2, 
  FiCheckCircle, FiXCircle, FiClock, FiTrendingUp,
  FiEye, FiDownload
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { bloodRequests } = useAuth();

  // Calculate statistics
  const stats = {
    totalRequests: bloodRequests.length,
    openRequests: bloodRequests.filter(r => r.status === 'open').length,
    assignedRequests: bloodRequests.filter(r => r.status === 'assigned').length,
    completedRequests: bloodRequests.filter(r => r.status === 'completed').length,
    donorAccepted: bloodRequests.reduce((sum, req) => 
      sum + req.donorResponses.filter(r => r.response === 'accepted').length, 0
    ),
    donorRejected: bloodRequests.reduce((sum, req) => 
      sum + req.donorResponses.filter(r => r.response === 'rejected').length, 0
    ),
    bloodBankAccepted: bloodRequests.reduce((sum, req) => 
      sum + req.bloodBankResponses.filter(r => r.response === 'accepted').length, 0
    ),
    bloodBankRejected: bloodRequests.reduce((sum, req) => 
      sum + req.bloodBankResponses.filter(r => r.response === 'rejected').length, 0
    ),
    assignedToDonors: bloodRequests.filter(r => r.assignedType === 'donor').length,
    assignedToBanks: bloodRequests.filter(r => r.assignedType === 'blood-bank').length
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

  const exportData = () => {
    const dataStr = JSON.stringify(bloodRequests, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'lifelink-requests.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Complete system monitoring and tracking</p>
          </div>
          <button
            onClick={exportData}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center space-x-2"
          >
            <FiDownload />
            <span>Export All Data</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{stats.totalRequests}</p>
              </div>
              <FiBarChart2 className="h-8 w-8 text-blue-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {stats.openRequests} open, {stats.assignedRequests} assigned
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Donor Responses</p>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-bold">{stats.donorAccepted}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-red-600 font-bold">{stats.donorRejected}</span>
                </div>
              </div>
              <FiUsers className="h-8 w-8 text-green-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Accepted | Rejected</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blood Bank Responses</p>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-bold">{stats.bloodBankAccepted}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-red-600 font-bold">{stats.bloodBankRejected}</span>
                </div>
              </div>
              <FiDroplet className="h-8 w-8 text-red-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Accepted | Rejected</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assignments</p>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-bold">{stats.assignedToDonors}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-purple-600 font-bold">{stats.assignedToBanks}</span>
                </div>
              </div>
              <FiCheckCircle className="h-8 w-8 text-purple-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Donors | Blood Banks</div>
          </div>
        </div>
      </div>

      {/* Detailed Request Tracking */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Complete Request Tracking</h2>
              <p className="text-gray-600">Monitor all blood requests and responses</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Showing {bloodRequests.length} requests
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {bloodRequests.length === 0 ? (
            <div className="text-center py-12">
              <FiEye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No blood requests in the system yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bloodRequests.map((request) => (
                <div key={request.id} className="border rounded-xl p-4 hover:shadow-md transition-all">
                  <div className="mb-4">
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
                          ✓ Assigned to: {request.acceptedBy} ({request.assignedType})
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Blood Group</p>
                        <p className="font-bold text-lg">{request.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Units</p>
                        <p className="font-semibold">{request.units} units</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Beneficiary</p>
                        <p className="font-semibold">{request.beneficiaryName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Hospital</p>
                        <p className="font-semibold">{request.hospital}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>📍 {request.location} | 📞 {request.contactPhone} | 🕐 {request.createdAt}</p>
                      {request.notes && (
                        <p className="mt-2 p-2 bg-gray-50 rounded">{request.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Responses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Donor Responses */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Donor Responses</h4>
                        <span className="text-sm text-gray-500">
                          {request.donorResponses.length} responses
                        </span>
                      </div>
                      <div className="space-y-2">
                        {request.donorResponses.length > 0 ? (
                          request.donorResponses.map((response, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="font-medium">{response.donorName}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                response.response === 'accepted' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {response.response.toUpperCase()} at {response.time}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">No donor responses yet</p>
                        )}
                      </div>
                    </div>

                    {/* Blood Bank Responses */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Blood Bank Responses</h4>
                        <span className="text-sm text-gray-500">
                          {request.bloodBankResponses.length} responses
                        </span>
                      </div>
                      <div className="space-y-2">
                        {request.bloodBankResponses.length > 0 ? (
                          request.bloodBankResponses.map((response, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="font-medium">{response.bloodBankName}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                response.response === 'accepted' ? 'bg-green-100 text-green-800' :
                                response.response === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {response.response.toUpperCase()} {response.time ? `at ${response.time}` : ''}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">No blood bank responses yet</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rejected By List */}
                  {request.rejectedBy.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-900 mb-2">Rejected By:</p>
                      <div className="flex flex-wrap gap-2">
                        {request.rejectedBy.map((name, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">System Status</p>
              <p className="text-lg font-bold text-blue-900">All Systems Operational</p>
            </div>
            <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 font-medium">Response Rate</p>
              <p className="text-lg font-bold text-green-900">
                {stats.totalRequests > 0 
                  ? `${Math.round(((stats.donorAccepted + stats.bloodBankAccepted) / stats.totalRequests) * 100)}%`
                  : '0%'
                } Acceptance
              </p>
            </div>
            <FiTrendingUp className="h-8 w-8 text-green-300" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-800 font-medium">Last Updated</p>
              <p className="text-lg font-bold text-purple-900">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <FiClock className="h-8 w-8 text-purple-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;