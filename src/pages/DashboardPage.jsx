import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Placeholder landing screen. Replace with the real dashboard (occupancy, unpaid bills, open tickets).
export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="page">
      <h1 className="page-title">Welcome, {user.fullName.split(' ')[0]}</h1>
      <section className="panel">
        <p>You're signed in as {user.role === 'ADMIN' ? 'an admin' : 'staff'}. Tenant, room, billing and maintenance screens will appear here as the team builds them.</p>
        <Link to="/account" className="btn btn-secondary">Edit my account</Link>
      </section>
    </div>
  );
}
