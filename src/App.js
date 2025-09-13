import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';


// Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import AgentProfile from './pages/AgentProfile';
import TrainingSession from './pages/TrainingSession';
import TrainingCenter from './pages/TrainingCenter';
import Analytics from './pages/Analytics';
import Welcome from './pages/Welcome';
import Login from './pages/Login';

// Prompt Components
import PromptList from './components/Prompt/PromptList';
import PromptForm from './components/Prompt/PromptForm';
import PromptView from './components/Prompt/PromptView';

// Import TPOD components
import TpOdList from './components/Tpod/TpOdList';
import TpOdForm from './components/Tpod/TpOdForm';
import TpOdView from './components/Tpod/TpOdView';

// Context
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';


import VoiceInputDemo from './components/VoiceInput/VoiceInputDemo';

import VoiceChat from './components/VoiceChat/VoiceChat';

import NovaSonicVoiceChat from './components/VoiceChat/NovaSonicVoiceChat';

// Utils
import { ROLES } from '../src/util/roles';

// Styles
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
          color: 'white',
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h4" component="h1" textAlign="center">
            Loading Synchrony Agent Training Hub...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <UserProvider>
      <AppProvider>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Header onSidebarToggle={handleSidebarToggle} />
          <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 0,
              marginTop: '64px',
              marginLeft: sidebarOpen ? '60px' : '80px',
              transition: 'margin 0.3s ease',
              '@media (max-width: 900px)': {
                marginLeft: 0,
              },
            }}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes - Everyone */}
              <Route
                path="/welcome"
                element={
                  <ProtectedRoute allowUnauthenticated={true}>
                    <Welcome />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prompts"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <PromptList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prompts/create"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <PromptForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prompts/:id"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <PromptView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prompts/:id/edit"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <PromptForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/scenario-engines"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <div>Scenario Engines Page - Admin Only</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              {/* Admin + Trainee Routes */}
              <Route
                path="/training-center"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.TRAINEE]}>
                    <TrainingCenter />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/training/:sessionId"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.TRAINEE]}>
                    <TrainingSession />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/performance"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.TRAINEE]}>
                    <div>Performance Page</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/agent/:agentId"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.TRAINEE]}>
                    <AgentProfile />
                  </ProtectedRoute>
                }
              />

              {/* Settings and Help - Authenticated Users */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.TRAINEE]}>
                    <div>Settings Page</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/help"
                element={
                  <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.TRAINEE]}>
                    <div>Help & Support Page</div>
                  </ProtectedRoute>
                }
              />

              <Route path="/tpods" element={<TpOdList />} />
              <Route path="/tpods/create" element={<TpOdForm />} />
              <Route path="/tpods/:id" element={<TpOdView />} />
              <Route path="/tpods/:id/edit" element={<TpOdForm />} />

              <Route path="/voice-demo" element={<VoiceInputDemo />} />

              <Route path="/voice-chat" element={<VoiceChat />} />

              <Route path="/nova-sonic-chat" element={<NovaSonicVoiceChat />} />



              {/* Default Redirects */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </Routes>
          </Box>
        </Box>
      </AppProvider>
    </UserProvider>
  );
}

export default App;
