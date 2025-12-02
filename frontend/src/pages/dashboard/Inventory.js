import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Inventory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inventoryUpdate, setInventoryUpdate] = useState({});

  // Fetch blood bank inventory
  const { data: bloodBank, isLoading } = useQuery({
    queryKey: ['bloodBank'],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/blood-banks/user/${user?._id}`);
      return response.data.data;
    },
    enabled: !!user && user.role === 'blood-bank'
  });

  // Update inventory mutation
  const updateInventoryMutation = useMutation({
    mutationFn: (inventoryData) => 
      axios.put(`/api/v1/blood-banks/${bloodBank?._id}/inventory`, inventoryData),
    onSuccess: () => {
      queryClient.invalidateQueries(['bloodBank']);
      toast.success('Inventory updated successfully');
      setInventoryUpdate({});
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update inventory');
    }
  });

  // Chart data
  const chartData = {
    labels: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    datasets: [
      {
        label: 'Blood Units Available',
        data: bloodBank ? [
          bloodBank.inventory['A+'],
          bloodBank.inventory['A-'],
          bloodBank.inventory['B+'],
          bloodBank.inventory['B-'],
          bloodBank.inventory['O+'],
          bloodBank.inventory['O-'],
          bloodBank.inventory['AB+'],
          bloodBank.inventory['AB-']
        ] : [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(168, 85, 247, 0.5)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blood Inventory Dashboard'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Units'
        }
      }
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!bloodBank) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">No Blood Bank Profile Found</h2>
        <p className="text-gray-600 mt-2">Please complete your blood bank registration</p>
      </div>
    );
  }

  const handleUpdate = (bloodGroup, value) => {
    setInventoryUpdate(prev => ({
      ...prev,
      [bloodGroup]: parseInt(value) || 0
    }));
  };

  const handleSave = () => {
    updateInventoryMutation.mutate(inventoryUpdate);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blood Inventory Management</h1>
        <p className="text-gray-600 mt-2">Manage your blood stock levels in real-time</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-2xl font-bold">
                {Object.values(bloodBank.inventory).reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Critical Low</p>
              <p className="text-2xl font-bold">
                {bloodGroups.filter(bg => bloodBank.inventory[bg] < 5).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Optimal Levels</p>
              <p className="text-2xl font-bold">
                {bloodGroups.filter(bg => bloodBank.inventory[bg] >= 10).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Updated</p>
              <p className="text-2xl font-bold">Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Inventory Management Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Manage Inventory Levels</h2>
          <p className="text-gray-600 text-sm">Update the number of units available for each blood type</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Add/Remove Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bloodGroups.map((bloodGroup) => {
                const currentStock = bloodBank.inventory[bloodGroup];
                const updateValue = inventoryUpdate[bloodGroup] || 0;
                const newTotal = currentStock + updateValue;
                const isCritical = currentStock < 5;
                const isLow = currentStock < 10;

                return (
                  <tr key={bloodGroup}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-red-50">
                          <span className="text-lg font-bold text-red-600">{bloodGroup}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {bloodGroup}
                          </div>
                          <div className="text-sm text-gray-500">
                            Universal {bloodGroup.includes('O-') ? 'Donor' : bloodGroup.includes('AB+') ? 'Recipient' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-2xl font-bold">{currentStock}</div>
                      <div className="text-sm text-gray-500">units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdate(bloodGroup, updateValue - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <span className="text-lg">-</span>
                        </button>
                        <input
                          type="number"
                          value={updateValue}
                          onChange={(e) => handleUpdate(bloodGroup, e.target.value)}
                          className="w-20 px-3 py-1 border border-gray-300 rounded text-center"
                          min="-999"
                          max="999"
                        />
                        <button
                          onClick={() => handleUpdate(bloodGroup, updateValue + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <span className="text-lg">+</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-2xl font-bold ${
                        newTotal < 0 ? 'text-red-600' : 
                        newTotal > currentStock ? 'text-green-600' : 
                        'text-gray-900'
                      }`}>
                        {newTotal}
                      </div>
                      <div className="text-sm text-gray-500">
                        {updateValue !== 0 && (
                          <span className={updateValue > 0 ? 'text-green-600' : 'text-red-600'}>
                            {updateValue > 0 ? '+' : ''}{updateValue}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isCritical ? 'bg-red-100 text-red-800' :
                        isLow ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {isCritical ? 'Critical' : isLow ? 'Low' : 'Good'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Total Units After Update: 
                <span className="ml-2 font-bold">
                  {Object.values(bloodBank.inventory).reduce((a, b) => a + b, 0) + 
                   Object.values(inventoryUpdate).reduce((a, b) => a + b, 0)}
                </span>
              </p>
            </div>
            <div className="space-x-3">
              <button
                onClick={() => setInventoryUpdate({})}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset Changes
              </button>
              <button
                onClick={handleSave}
                disabled={updateInventoryMutation.isLoading || Object.keys(inventoryUpdate).length === 0}
                className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateInventoryMutation.isLoading ? 'Saving...' : 'Save Inventory Updates'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;