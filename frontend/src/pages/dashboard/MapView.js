import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom markers
const donorIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const bloodBankIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const requestIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 13);
      onLocationSelect(e.latlng);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

const MapView = () => {
  const [center, setCenter] = useState([20.5937, 78.9629]); // India center
  const [radius, setRadius] = useState(10);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedType, setSelectedType] = useState('donors'); // donors, blood-banks, requests
  const mapRef = useRef(null);

  // Fetch nearby donors
  const { data: donors, refetch: refetchDonors } = useQuery({
    queryKey: ['nearbyDonors', center, radius, selectedBloodGroup],
    queryFn: async () => {
      const response = await axios.get('/api/v1/donors/nearby', {
        params: {
          lat: center[0],
          lng: center[1],
          radius,
          bloodGroup: selectedBloodGroup || undefined
        }
      });
      return response.data.data;
    },
    enabled: selectedType === 'donors'
  });

  // Fetch nearby blood banks
  const { data: bloodBanks, refetch: refetchBloodBanks } = useQuery({
    queryKey: ['nearbyBloodBanks', center, radius],
    queryFn: async () => {
      const response = await axios.get('/api/v1/blood-banks/nearby', {
        params: {
          lat: center[0],
          lng: center[1],
          radius
        }
      });
      return response.data.data;
    },
    enabled: selectedType === 'blood-banks'
  });

  // Fetch nearby requests
  const { data: requests, refetch: refetchRequests } = useQuery({
    queryKey: ['nearbyRequests', center, radius],
    queryFn: async () => {
      const response = await axios.get('/api/v1/requests/nearby', {
        params: {
          lat: center[0],
          lng: center[1],
          radius
        }
      });
      return response.data.data;
    },
    enabled: selectedType === 'requests'
  });

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: (location) => axios.put('/api/v1/donors/location', location),
    onSuccess: () => {
      toast.success('Location updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update location');
    }
  });

  const handleLocationSelect = (latlng) => {
    setCenter([latlng.lat, latlng.lng]);
    updateLocationMutation.mutate({
      lat: latlng.lat,
      lng: latlng.lng
    });
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-white p-4 shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Map Controls</h2>
        
        <div className="space-y-6">
          {/* Search Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search For
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['donors', 'blood-banks', 'requests'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    selectedType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Blood Group Filter */}
          {selectedType === 'donors' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Blood Group
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedBloodGroup('')}
                  className={`px-2 py-1 rounded text-xs ${
                    selectedBloodGroup === ''
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All
                </button>
                {bloodGroups.map(group => (
                  <button
                    key={group}
                    onClick={() => setSelectedBloodGroup(group)}
                    className={`px-2 py-1 rounded text-xs ${
                      selectedBloodGroup === group
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Radius Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius: {radius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Results */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">
              {selectedType === 'donors' && `Donors (${donors?.length || 0})`}
              {selectedType === 'blood-banks' && `Blood Banks (${bloodBanks?.length || 0})`}
              {selectedType === 'requests' && `Requests (${requests?.length || 0})`}
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedType === 'donors' && donors?.map(donor => (
                <div key={donor._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <p className="text-sm text-gray-600">
                        Blood Group: <span className="font-semibold">{donor.bloodGroup}</span>
                      </p>
                      <p className="text-sm text-gray-600">Distance: {donor.distance?.toFixed(2)} km</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      donor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {donor.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              ))}

              {selectedType === 'blood-banks' && bloodBanks?.map(bank => (
                <div key={bank._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <p className="font-medium">{bank.name}</p>
                  <p className="text-sm text-gray-600">{bank.address?.city}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {bank.verified ? 'Verified' : 'Pending'}
                    </span>
                    <button className="text-xs text-primary-600 hover:text-primary-800">
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {selectedType === 'requests' && requests?.map(request => (
                <div key={request._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border-l-4 border-primary-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{request.patientName}</p>
                      <p className="text-sm text-gray-600">
                        Blood: <span className="font-semibold">{request.bloodGroup}</span>
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        Urgency: <span className={`font-semibold ${
                          request.urgency === 'critical' ? 'text-red-600' :
                          request.urgency === 'high' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {request.urgency}
                        </span>
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      request.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={13}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <LocationMarker onLocationSelect={handleLocationSelect} />
          
          {/* Search radius circle */}
          <Circle
            center={center}
            radius={radius * 1000}
            pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue' }}
          />

          {/* Donor markers */}
          {selectedType === 'donors' && donors?.map(donor => (
            <Marker
              key={donor._id}
              position={[donor.location.coordinates[1], donor.location.coordinates[0]]}
              icon={donorIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{donor.name}</h3>
                  <p>Blood Group: {donor.bloodGroup}</p>
                  <p>Status: {donor.isAvailable ? 'Available' : 'Not Available'}</p>
                  <p>Distance: {donor.distance?.toFixed(2)} km</p>
                  <button className="mt-2 px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm">
                    Contact
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Blood bank markers */}
          {selectedType === 'blood-banks' && bloodBanks?.map(bank => (
            <Marker
              key={bank._id}
              position={[bank.location.coordinates[1], bank.location.coordinates[0]]}
              icon={bloodBankIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{bank.name}</h3>
                  <p>{bank.address?.street}</p>
                  <p>{bank.address?.city}, {bank.address?.state}</p>
                  <p>Phone: {bank.contactInfo?.phone}</p>
                  <div className="mt-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mr-2">
                      View Inventory
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                      Request Blood
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Request markers */}
          {selectedType === 'requests' && requests?.map(request => (
            <Marker
              key={request._id}
              position={[request.location.coordinates[1], request.location.coordinates[0]]}
              icon={requestIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">Blood Request</h3>
                  <p>Patient: {request.patientName}</p>
                  <p>Blood Group: {request.bloodGroup}</p>
                  <p>Units: {request.unitsRequired}</p>
                  <p>Urgency: <span className={`font-semibold ${
                    request.urgency === 'critical' ? 'text-red-600' :
                    request.urgency === 'high' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`}>
                    {request.urgency}
                  </span></p>
                  <div className="mt-2">
                    <button className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm">
                      Accept Request
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => mapRef.current?.locate()}
            className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
            title="Locate me"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={() => {
              refetchDonors();
              refetchBloodBanks();
              refetchRequests();
            }}
            className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
            title="Refresh data"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;