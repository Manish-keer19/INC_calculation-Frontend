import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

import ProtectedRoute from './components/ProtectedRoute';
import { loadFromStorage } from './store/authSlice';
import { loadFromStorage as loadDataFromStorage } from './store/dataSlice';

// Component to handle root route authentication logic
const AuthRoute = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// Component to prevent authenticated users from accessing login/signup
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFromStorage());
    dispatch(loadDataFromStorage());
  }, [dispatch]);

  return (
    <div className="font-sans">
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<AuthRoute />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;