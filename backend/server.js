const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Demo data
const demoUsers = [
  { id: '1', name: 'Demo Donor', email: 'donor@demo.com', role: 'donor', bloodGroup: 'O+', isAvailable: true },
  { id: '2', name: 'Blood Bank', email: 'bloodbank@demo.com', role: 'blood-bank' },
  { id: '3', name: 'NGO Demo', email: 'ngo@demo.com', role: 'ngo' },
  { id: '4', name: 'Admin', email: 'admin@demo.com', role: 'admin' }
];

const demoRequests = [
  { id: '1', patientName: 'John Smith', bloodGroup: 'A+', units: 2, urgency: 'critical', status: 'open', location: 'New York' },
  { id: '2', patientName: 'Sarah Johnson', bloodGroup: 'O-', units: 3, urgency: 'high', status: 'assigned', location: 'Brooklyn' }
];

// Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, role } = req.body;
  const newUser = { id: Date.now().toString(), name, email, role: role || 'donor' };
  demoUsers.push(newUser);
  res.json({ success: true, token: 'demo-token', user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = demoUsers.find(u => u.email === email) || demoUsers[0];
  res.json({ success: true, token: 'demo-token', user });
});

app.get('/api/requests', (req, res) => {
  res.json({ success: true, data: demoRequests });
});

app.get('/api/users', (req, res) => {
  res.json({ success: true, data: demoUsers });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Demo Backend running on port ${PORT}`);
  console.log(`📌 Use these demo emails: donor@demo.com, bloodbank@demo.com, ngo@demo.com, admin@demo.com`);
  console.log(`📌 Password for all: password`);
});