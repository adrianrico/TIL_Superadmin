// Exige sesión; si no la hay, redirige a /login.
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import GlobalLoader from './GlobalLoader.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <GlobalLoader visible />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
