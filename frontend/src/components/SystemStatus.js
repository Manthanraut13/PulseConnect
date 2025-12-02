import React, { useState, useEffect } from 'react';
import { FiWifi, FiDatabase, FiServer, FiActivity } from 'react-icons/fi';

const SystemStatus = () => {
  const [status, setStatus] = useState({
    backend: { online: true, latency: 45 },
    database: { online: true, connections: 24 },
    realtime: { online: true, users: 4 },
    api: { online: true, requests: 128 }
  });

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        api: { ...prev.api, requests: prev.api.requests + Math.floor(Math.random() * 3) }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StatusCard = ({ title, online, icon, metric, unit }) => (
    <div className={`p-4 rounded-xl ${online ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${online ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {icon}
          </div>
          <div>
            <p className="font-medium text-gray-900">{title}</p>
            <p className={`text-sm ${online ? 'text-green-600' : 'text-red-600'}`}>
              {online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{metric}</p>
          <p className="text-xs text-gray-500">{unit}</p>
        </div>
      </div>
      {online && (
        <div className="mt-2">
          <div className="h-1 w-full bg-green-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${Math.min(100, (metric / 150) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">System Status</h3>
          <p className="text-gray-600">Real-time monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-green-600 font-medium">All Systems Go</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <StatusCard 
          title="Backend API" 
          online={status.backend.online} 
          icon={<FiServer className="h-5 w-5" />}
          metric={status.backend.latency}
          unit="ms latency"
        />
        <StatusCard 
          title="Database" 
          online={status.database.online} 
          icon={<FiDatabase className="h-5 w-5" />}
          metric={status.database.connections}
          unit="connections"
        />
        <StatusCard 
          title="Real-time" 
          online={status.realtime.online} 
          icon={<FiActivity className="h-5 w-5" />}
          metric={status.realtime.users}
          unit="active users"
        />
        <StatusCard 
          title="API Requests" 
          online={status.api.online} 
          icon={<FiWifi className="h-5 w-5" />}
          metric={status.api.requests}
          unit="requests/min"
        />
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</p>
          <button className="text-sm text-red-600 hover:text-red-700">
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;