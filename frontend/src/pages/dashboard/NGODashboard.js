import React, { useState } from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiPlus, FiDroplet, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const NGODashboard = () => {
  const [drives, setDrives] = useState([
    { 
      id: 1, 
      title: 'Community Blood Drive', 
      description: 'Annual community blood donation drive', 
      date: '2024-01-20', 
      location: 'Community Center, Main St', 
      expectedDonors: 50,
      collectedUnits: 45,
      status: 'completed',
      suppliedTo: 'City Blood Bank',
      supplyDate: '2024-01-21'
    },
    { 
      id: 2, 
      title: 'Emergency Blood Collection', 
      description: 'Emergency blood collection for disaster relief', 
      date: '2024-01-25', 
      location: 'Red Cross Center, Help St', 
      expectedDonors: 30,
      collectedUnits: 0,
      status: 'planned',
      suppliedTo: null,
      supplyDate: null
    },
    { 
      id: 3, 
      title: 'Corporate Blood Donation', 
      description: 'Blood donation camp at Tech Corp Office', 
      date: '2024-01-18', 
      location: 'Tech Corp Campus', 
      expectedDonors: 80,
      collectedUnits: 72,
      status: 'ongoing',
      suppliedTo: 'Regional Blood Center',
      supplyDate: '2024-01-19'
    }
  ]);

  const [showDriveForm, setShowDriveForm] = useState(false);
  const [newDrive, setNewDrive] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    expectedDonors: ''
  });

  const handleCreateDrive = (e) => {
    e.preventDefault();
    const newDriveItem = {
      id: drives.length + 1,
      ...newDrive,
      expectedDonors: parseInt(newDrive.expectedDonors) || 0,
      collectedUnits: 0,
      status: 'planned',
      suppliedTo: null,
      supplyDate: null
    };
    setDrives([newDriveItem, ...drives]);
    setShowDriveForm(false);
    setNewDrive({
      title: '',
      description: '',
      date: '',
      location: '',
      expectedDonors: ''
    });
    toast.success('Blood drive created successfully!');
  };

  const handleSupplyBlood = (driveId, bloodBank) => {
    setDrives(prev => prev.map(drive => 
      drive.id === driveId ? { 
        ...drive, 
        suppliedTo: bloodBank,
        supplyDate: new Date().toLocaleDateString(),
        status: 'completed'
      } : drive
    ));
    toast.success(`Blood supplied to ${bloodBank}!`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCollected = drives.reduce((sum, drive) => sum + drive.collectedUnits, 0);
  const totalExpected = drives.reduce((sum, drive) => sum + drive.expectedDonors, 0);
  const ongoingDrives = drives.filter(drive => drive.status === 'ongoing').length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Blood Drive Management
              </span>
            </div>
            <p className="text-gray-600">
              Organize blood donation drives and supply collected blood to blood banks
            </p>
          </div>
          <button
            onClick={() => setShowDriveForm(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
          >
            <FiPlus />
            <span>Create Blood Drive</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Drives</p>
                <p className="text-2xl font-bold">{drives.length}</p>
              </div>
              <FiCalendar className="h-8 w-8 text-green-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Organized by you</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blood Collected</p>
                <p className="text-2xl font-bold">{totalCollected}</p>
              </div>
              <FiDroplet className="h-8 w-8 text-red-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Units collected</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ongoing Drives</p>
                <p className="text-2xl font-bold text-green-600">{ongoingDrives}</p>
              </div>
              <FiUsers className="h-8 w-8 text-blue-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Active now</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Supply Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {drives.filter(d => d.suppliedTo).length > 0 
                    ? `${Math.round((drives.filter(d => d.suppliedTo).length / drives.length) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
              <FiTruck className="h-8 w-8 text-purple-200" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Supplied to banks</div>
          </div>
        </div>
      </div>

      {/* Create Drive Modal - Keep similar to previous but simplified */}
      {/* ... (similar form as before) */}

      {/* Blood Drives List with Supply Option */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Blood Donation Drives</h2>
              <p className="text-gray-600">Organize drives and supply collected blood to banks</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {drives.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No blood drives created yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drives.map((drive) => (
                <div key={drive.id} className="border rounded-xl p-4 hover:shadow-md transition-all">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{drive.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(drive.status)}`}>
                          {drive.status.toUpperCase()}
                        </span>
                        {drive.suppliedTo && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                            ✓ Supplied to {drive.suppliedTo}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{drive.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-semibold">{drive.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold">{drive.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Collected</p>
                          <p className="font-semibold">{drive.collectedUnits} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Expected</p>
                          <p className="font-semibold">{drive.expectedDonors} donors</p>
                        </div>
                      </div>
                      
                      {drive.suppliedTo && (
                        <div className="mt-3 p-2 bg-green-50 rounded">
                          <p className="text-sm text-green-800">
                            ✓ Supplied {drive.collectedUnits} units to {drive.suppliedTo} on {drive.supplyDate}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {drive.status === 'ongoing' && drive.collectedUnits > 0 && !drive.suppliedTo && (
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleSupplyBlood(drive.id, 'City Blood Bank')}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center justify-center space-x-2"
                        >
                          <FiTruck />
                          <span>Supply to City Blood Bank</span>
                        </button>
                        <button
                          onClick={() => handleSupplyBlood(drive.id, 'Regional Blood Center')}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center justify-center space-x-2"
                        >
                          <FiTruck />
                          <span>Supply to Regional Center</span>
                        </button>
                      </div>
                    )}
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

export default NGODashboard;