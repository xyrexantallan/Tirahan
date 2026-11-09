import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="shell">
      <header className="topbar">
        <span className="topbar-brand">Tirahan</span>
        <nav className="topbar-nav" aria-label="Main">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/account">My account</NavLink>
        </nav>
        <div className="topbar-user">
          <span className="topbar-name">{user.fullName}</span>
          <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role === 'ADMIN' ? 'Admin' : 'Staff'}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign out</button>
        </div>
      </header>
      <div className="shell-body"><Outlet /></div>
    </div>
  );
}
