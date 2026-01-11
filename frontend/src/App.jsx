import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FlightList from './components/FlightList';
import AddFlight from './components/AddFlight';
import EditFlight from './components/EditFlight';
import FlightDetail from './components/FlightDetail';
import FlightMap from './components/FlightMap';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flights/list"
        element={
          <ProtectedRoute>
            <FlightList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flights/add"
        element={
          <ProtectedRoute>
            <AddFlight />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flights/edit/:id"
        element={
          <ProtectedRoute>
            <EditFlight />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flights/:id"
        element={
          <ProtectedRoute>
            <FlightDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flights/map"
        element={
          <ProtectedRoute>
            <FlightMap />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
