import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import AdminLayout from './components/AdminLayout';
import VolunteerLayout from './components/VolunteerLayout';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin pages
import Dashboard from './pages/Dashboard';
import Volunteers from './pages/Volunteers';
import Tasks from './pages/Tasks';
import MatchResults from './pages/MatchResults';
import Analytics from './pages/admin/Analytics';
import AdminNotifications from './pages/admin/Notifications';
import Feedback from './pages/admin/Feedback';
import AIAssistant from './pages/admin/AIAssistant';

// Volunteer pages
import VolDashboard from './pages/volunteer/VolDashboard';
import MyTasks from './pages/volunteer/MyTasks';
import Profile from './pages/volunteer/Profile';
import Impact from './pages/volunteer/Impact';
import VolNotifications from './pages/volunteer/VolNotifications';

// New pages
import Organizations from './pages/Organizations';
import Resources from './pages/Resources';

// Footer pages
import {
  FindOpportunities, ForOrganizations, AIMatching, AnalyticsInfo,
  Documentation, Blog, Community,
  About, Careers, Privacy, Terms,
} from './pages/FooterPages';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="match" element={<MatchResults />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="ai" element={<AIAssistant />} />
        </Route>

        {/* Volunteer */}
        <Route path="/volunteer" element={<VolunteerLayout />}>
          <Route index element={<VolDashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="impact" element={<Impact />} />
          <Route path="notifications" element={<VolNotifications />} />
        </Route>

        {/* Public pages */}
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/resources" element={<Resources />} />

        {/* Footer Pages - Platform */}
        <Route path="/find-opportunities" element={<FindOpportunities />} />
        <Route path="/for-organizations" element={<ForOrganizations />} />
        <Route path="/ai-matching" element={<AIMatching />} />
        <Route path="/analytics-info" element={<AnalyticsInfo />} />

        {/* Footer Pages - Resources */}
        <Route path="/docs" element={<Documentation />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/community" element={<Community />} />

        {/* Footer Pages - Company */}
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm',
          duration: 3000,
          style: { border: '1px solid #e2e8f0', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.12)' },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
