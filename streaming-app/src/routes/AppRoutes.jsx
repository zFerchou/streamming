
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import VideoPage from '../pages/VideoPage';
import UploadPage from '../pages/UploadPage';
import AdminDashboard from '../pages/AdminDashboard';
import LiveStreamPage from '../pages/LiveStreamPage';
import ProtectedRoute from '../components/ProtectedRoute';
import RegisterPage from '../pages/RegisterPage';
import ProfileSettingsPage from '../pages/ProfileSettingsPage.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/video/:id" element={<VideoPage />} />
    <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
    <Route path="/live" element={<ProtectedRoute><LiveStreamPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
  </Routes>
);

export default AppRoutes;