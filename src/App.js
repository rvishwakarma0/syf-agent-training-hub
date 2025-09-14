// App.js - COMPLETE REPLACEMENT
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Layout Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Profile from './pages/Profile';
import Analytics from './pages/admin/Analytics';
import Dashboard from './pages/admin/Dashboard';
import Welcome from './pages/trainee/Welcome';
import TrainingCenter from './pages/trainee/TrainingCenter';

// Admin Components
import PromptList from './components/Prompt/PromptList';
import PromptForm from './components/Prompt/PromptForm';
import PromptView from './components/Prompt/PromptView';
import TpOdList from './components/Tpod/TpOdList';
import TpOdForm from './components/Tpod/TpOdForm';
import TpOdView from './components/Tpod/TpOdView';

// Context
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';





// Utils
import { ROLES } from './util/roles';
// Styles
import './App.css';
import Performance from './pages/trainee/Performace';
import VoiceTraining from './pages/trainee/VoiceTraining';
import TextTraining from './pages/trainee/TextTraining';



// Layout wrapper component for protected routes
const AppLayout = ({ children }) => (
  <Box sx={{ display: 'flex' }}>
    <Header />
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 3,
        mt: 8, // Account for fixed header
        ml: '60px', // Account for sidebar width
      }}
    >
      {children}
    </Box>
  </Box>
);

function App() {
  return (
    <UserProvider>
      <AppProvider>
        <Routes>
          {/* Public Routes - No layout */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - With layout */}
          
          <Route path="/profile" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.TRAINEE]}>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/welcome" element={
            <ProtectedRoute requiredRoles={[ROLES.TRAINEE]}>
              <AppLayout>
                <Welcome />
              </AppLayout>
            </ProtectedRoute>
          } />


          <Route path="/training-center" element={
            <ProtectedRoute requiredRoles={[ROLES.TRAINEE]}>
              <AppLayout>
                <TrainingCenter />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/text-training/:tpodId" element={
            <ProtectedRoute requiredRoles={[ROLES.TRAINEE]}>
              <AppLayout>
                <TextTraining />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/performance" element={
            <ProtectedRoute requiredRoles={[ROLES.TRAINEE]}>
              <AppLayout>
                <Performance />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/voice-training/:tpodId" element={
            <ProtectedRoute requiredRoles={[ ROLES.TRAINEE]}>
              <AppLayout>
                <VoiceTraining />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/prompts" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <PromptList />
              </AppLayout>
            </ProtectedRoute>
          } />

          

          <Route path="/prompts/create" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <PromptForm />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/prompts/:id" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <PromptView />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/prompts/:id/edit" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <PromptForm />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/tpods" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <TpOdList />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/tpods/create" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <TpOdForm />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/tpods/:id" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <TpOdView />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/tpods/:id/edit" element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AppLayout>
                <TpOdForm />
              </AppLayout>
            </ProtectedRoute>
          } />


              {/* <Route path="/voice-chat" element={<VoiceChat />} /> */}
              {/* Default Redirects */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
            </Routes>
      </AppProvider>
    </UserProvider>
  );
}
 
export default App;
