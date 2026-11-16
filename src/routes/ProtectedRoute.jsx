import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME } from '../utils/roles';
import Spinner from '../components/Spinner';

// roles: allowed roles. super_admin may enter admin areas.
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Spinner full />;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (roles && !roles.includes(user.role) && user.role !== 'super_admin') return <Navigate to={ROLE_HOME[user.role]} replace />;
  return <Outlet />;
}
