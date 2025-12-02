import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const Transport = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [currentLocation, setCurrentLocation] = useState([20.5937, 78.9629]);
  const [routePath, setRoutePath] = useState([]);

  // Fetch transport profile
  const { data: transportProfile, isLoading } = useQuery({
    queryKey: ['transportProfile'],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/transport/user/${user?._id}`);
      return response.data.data;
    },
    enabled: !!user
  });

  // Fetch assigned deliveries
  const { data: deliveries } = useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/transport/deliveries/assigned');
      return response.data.data;
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ deliveryId, status }) =>
      axios.put(`/api/v1/transport/deliveries/${deliveryId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['deliveries']);
      toast.success('Status updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  });

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: (location) => 
      axios.put('/api/v1/transport/location', location),
    onSuccess: () => {
      toast.success('Location updated');
    }
  });

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          updateLocationMutation.mutate({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Socket for real-time tracking
  useEffect(() => {
    if (socket) {
      socket.emit('join', { 
        userId: user?._id, 
        role: 'transport',
        requestId: transportProfile?.currentAssignment?.requestId 
      });

      socket.on('transportLocationUpdate', (data) => {
        // Handle location updates from other transports
      });

      return () => {
        socket.off('transportLocationUpdate');
      };
    }
  }, [socket, user, transportProfile]);

  // Update location via socket
  const sendLocationUpdate = () => {
    if (socket && transportProfile?.currentAssignment?.requestId) {
      socket.emit('updateTransportLocation', {
        transportId: transportProfile._id,
        requestId: transportProfile.currentAssignment.requestId,
        location: {
          lat: currentLocation[0],
          lng: currentLocation[1]
        }
      });
    }
  };

  // Simulate route
  const calculateRoute = (from, to) => {
    // This would typically use a routing service
    // For demo, just create a simple line
    return [from, to];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transport Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage deliveries and track your location in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Current Assignment */}
        <div className="lg:col-span-2">
          {/* Map */}
          <div className="bg-white rounded-lg shadow h-96 mb-6">
            <MapContainer
              center={currentLocation}
              zoom={13}
              className="h-full w-full rounded-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Current location marker */}
              <Marker position={currentLocation}>
                <L.Popup>
                  <div>
                    <h3 className="font-bold">Your Location</h3>
                    <p>Lat: {currentLocation[0].toFixed(4)}</p>
                    <p>Lng: {currentLocation[1].toFixed(4)}</p>
                  </div>
                </L.Popup>
              </Marker>

              {/* Route line if available */}
              {routePath.length > 0 && (
                <Polyline pathOptions={{ color: 'blue' }} positions={routePath} />
              )}
            </MapContainer>
          </div>

          {/* Current Assignment */}
          {transportProfile?.currentAssignment ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Current Assignment</h2>
                  <p className="text-gray-600">Delivery #{transportProfile.currentAssignment.requestId?.slice(-6)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  transportProfile.currentAssignment.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                  transportProfile.currentAssignment.status === 'picked' ? 'bg-blue-100 text-blue-800' :
                  transportProfile.currentAssignment.status === 'in-transit' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {transportProfile.currentAssignment.status?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Delivery Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient Name:</span>
                      <span className="font-medium">John Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Group:</span>
                      <span className="font-medium">O+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Units:</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hospital:</span>
                      <span className="font-medium">City General Hospital</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Assigned</p>
                        <p className="text-sm text-gray-500">10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transportProfile.currentAssignment.status === 'picked' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        <span className="text-white text-sm">2</span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Pick Up</p>
                        <p className="text-sm text-gray-500">Blood bank location</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transportProfile.currentAssignment.status === 'in-transit' ? 'bg-purple-500' : 'bg-gray-300'
                      }`}>
                        <span className="text-white text-sm">3</span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">In Transit</p>
                        <p className="text-sm text-gray-500">To hospital</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">4</span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Delivered</p>
                        <p className="text-sm text-gray-500">Estimated: 12:30 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateStatusMutation.mutate({
                      deliveryId: transportProfile.currentAssignment._id,
                      status: 'picked'
                    })}
                    disabled={transportProfile.currentAssignment.status !== 'assigned'}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark as Picked Up
                  </button>
                  <button
                    onClick={() => updateStatusMutation.mutate({
                      deliveryId: transportProfile.currentAssignment._id,
                      status: 'in-transit'
                    })}
                    disabled={transportProfile.currentAssignment.status !== 'picked'}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Transit
                  </button>
                  <button
                    onClick={() => updateStatusMutation.mutate({
                      deliveryId: transportProfile.currentAssignment._id,
                      status: 'delivered'
                    })}
                    disabled={transportProfile.currentAssignment.status !== 'in-transit'}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark as Delivered
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Deliveries</h3>
              <p className="text-gray-600">You don't have any active delivery assignments at the moment.</p>
            </div>
          )}
        </div>

        {/* Right column: Stats and Controls */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed Deliveries</span>
                <span className="text-2xl font-bold">{transportProfile?.completedDeliveries || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Rating</span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">{transportProfile?.rating || 0}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (transportProfile?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  transportProfile?.status === 'available' ? 'bg-green-100 text-green-800' :
                  transportProfile?.status === 'on-duty' ? 'bg-blue-100 text-blue-800' :
                  transportProfile?.status === 'off-duty' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transportProfile?.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Location Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Controls</h3>
            <div className="space-y-4">
              <button
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const { latitude, longitude } = position.coords;
                      setCurrentLocation([latitude, longitude]);
                      updateLocationMutation.mutate({ lat: latitude, lng: longitude });
                      sendLocationUpdate();
                    },
                    (error) => console.error(error)
                  );
                }}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Update My Location
              </button>
              
              <button
                onClick={sendLocationUpdate}
                disabled={!transportProfile?.currentAssignment}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Send Location Update
              </button>
            </div>
          </div>

          {/* Recent Deliveries */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Deliveries</h3>
            <div className="space-y-3">
              {deliveries?.slice(0, 3).map(delivery => (
                <div key={delivery._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">#{delivery.requestId?.slice(-6)}</p>
                      <p className="text-sm text-gray-600">{delivery.bloodGroup} • {delivery.units} units</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      delivery.status === 'completed' ? 'bg-green-100 text-green-800' :
                      delivery.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {delivery.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(delivery.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transport;