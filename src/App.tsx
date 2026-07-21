/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ScanCard from './pages/ScanCard';
import MyCards from './pages/MyCards';
import ExportData from './pages/ExportData';
import LandingPage from './pages/LandingPage';
import PublicLayout from './components/PublicLayout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Blog from './pages/Blog';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';

// Redirects logged-in users to /dashboard, shows landing page to everyone else
function SmartHome() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

// Redirects non-logged-in users to home (landing page)
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with shared layout & footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<SmartHome />} />
            <Route path="/login" element={<SmartHome />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>

          {/* Protected app routes */}
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<ScanCard />} />
            <Route path="/cards" element={<MyCards />} />
            <Route path="/export" element={<ExportData />} />
          </Route>

          {/* Catch-all: redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
