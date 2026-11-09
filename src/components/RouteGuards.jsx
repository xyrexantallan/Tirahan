import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page-loading" role="status">Loading your account…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

// Signed-in users don't need the login/register screens.
export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading" role="status">Loading…</div>;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
