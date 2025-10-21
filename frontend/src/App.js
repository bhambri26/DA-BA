import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import '@/App.css';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TopicsPage from './pages/TopicsPage';
import ProjectsPage from './pages/ProjectsPage';
import TopicDetail from './pages/TopicDetail';
import ProjectDetail from './pages/ProjectDetail';
import AdminPanel from './pages/AdminPanel';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

axios.defaults.withCredentials = true;

function AuthHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      // Check for Emergent session_id in URL fragment
      const hash = location.hash;
      const sessionMatch = hash.match(/session_id=([^&]+)/);
      
      if (sessionMatch) {
        const sessionId = sessionMatch[1];
        setLoading(true);
        
        try {
          const response = await axios.get(`${API}/auth/emergent/session`, {
            headers: { 'X-Session-ID': sessionId }
          });
          
          localStorage.setItem('user', JSON.stringify(response.data.user));
          toast.success('Welcome! You are now logged in.');
          
          // Clean URL and redirect to dashboard
          window.location.hash = '';
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error('Auth error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/', { replace: true });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    handleAuth();
  }, [location.hash, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  return null;
}

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setChecking(false);
      } else {
        try {
          const response = await axios.get(`${API}/auth/me`);
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.log('Not authenticated');
        } finally {
          setChecking(false);
        }
      }
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed:', err));
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthHandler />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topics"
          element={
            <ProtectedRoute>
              <TopicsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topics/:topicId"
          element={
            <ProtectedRoute>
              <TopicDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
