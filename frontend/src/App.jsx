import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import RequestForm from './pages/RequestForm';
import StatusPage from './pages/StatusPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './utils/AdminRoute';
import FarmerRoute from './utils/FarmerRoute';
import Home from './pages/HomePage';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

        <Route path="/request" element={<FarmerRoute><RequestForm /></FarmerRoute>} />
        <Route path="/status" element={<FarmerRoute><StatusPage /></FarmerRoute>} />

        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
