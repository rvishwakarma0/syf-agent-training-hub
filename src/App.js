import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import AgentProfile from './pages/AgentProfile';
import TrainingSession from './pages/TrainingSession';
import TrainingCenter from './pages/TrainingCenter';
import Analytics from './pages/Analytics';
import Welcome from './pages/Welcome';

// Context
import { AppProvider } from './context/AppContext';

// Styles
import './App.css';
import Prompts from './pages/Prompts';
import ScenarioEngines from './pages/scenarioEngines';
import Performance from './pages/Performace';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
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
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: 50,
            height: 50,
            border: '4px solid #FFD100',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
          }}
        />
      </Box>
    );
  }

  return (
    <AppProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header onSidebarToggle={handleSidebarToggle} />
        
        <Sidebar 
          open={sidebarOpen} 
          onToggle={handleSidebarToggle}
        />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2, md: 2 }, // Reduced padding
            pt: { xs: 1, sm: 1, md: 1 }, // Minimal top padding
            mt: '64px', // Fixed header height
            ml: sidebarOpen ? { xs: 0, md: '240px' } : { xs: 0, md: '60px' },
            transition: 'margin-left 0.3s ease',
            minHeight: 'calc(100vh - 64px)',
            maxHeight: 'calc(100vh - 64px)', // Prevent overflow
            backgroundColor: '#f8f9fa',
            maxWidth: '100vw',
            overflow: 'auto', // Restore normal scrolling for all pages
            position: 'relative',
          }}
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/training" element={<TrainingCenter />} />
              <Route path="/training-center" element={<TrainingCenter />} />
              <Route path="/agent/:agentId" element={<AgentProfile />} />
              <Route path="/training/:sessionId" element={<TrainingSession />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/prompts" element={<Prompts />} />
              <Route path="/scenario-engines" element={<ScenarioEngines />} />
              <Route path="/performance" element={<Performance />} />
            </Routes>
          </AnimatePresence>
        </Box>
      </Box>
    </AppProvider>
  );
}

export default App;
