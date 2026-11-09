import { Link } from 'react-router-dom';

const ROOMS = [
  { no: '101', s: 'occupied' }, { no: '102', s: 'occupied' }, { no: '103', s: 'vacant' },
  { no: '201', s: 'occupied' }, { no: '202', s: 'maintenance' }, { no: '203', s: 'vacant' },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth-side" aria-hidden="true">
        <div className="plate">
          <span className="plate-screw" /><span className="plate-screw" />
          <span className="plate-name">Tirahan</span>
          <span className="plate-sub">Boarding house management</span>
        </div>
        <p className="auth-pitch">Rooms, tenants, meter readings and bills in one place.</p>
        <ul className="keytags">
          {ROOMS.map((r) => (
            <li key={r.no} className={`keytag ${r.s}`}>
              <span className="keytag-hole" />
              <strong>{r.no}</strong>
              <small>{r.s}</small>
            </li>
          ))}
        </ul>
      </aside>

      <main className="auth-main">
        <Link to="/login" className="auth-brand-mobile">Tirahan</Link>
        <div className="auth-card">
          <h1>{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
          {footer && <p className="auth-footer">{footer}</p>}
        </div>
      </main>
    </div>
  );
}
