import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Environments from './pages/Environments';
import Evaluations from './pages/Evaluations';
import EvaluationForm from './pages/EvaluationForm';
import Calendar from './pages/Calendar';
import Employees from './pages/Employees';
import CorrectiveActions from './pages/CorrectiveActions';

// Auth hook
import { useAuth } from './context/AuthContext';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasPermission, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !hasPermission(allowedRoles)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/environments"
            element={
              <ProtectedRoute>
                <Environments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/evaluations"
            element={
              <ProtectedRoute>
                <Evaluations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/evaluations/new"
            element={
              <ProtectedRoute allowedRoles={['manager', 'inspector']}>
                <EvaluationForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />

          <Route
            path="/corrective-actions"
            element={
              <ProtectedRoute>
                <CorrectiveActions />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
