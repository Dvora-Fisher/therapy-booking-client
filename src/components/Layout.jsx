import { NavLink, Outlet } from 'react-router-dom';
import { CalendarDays, CalendarPlus, ListChecks, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/labels';
import styles from './Layout.module.css';

const NAV_BY_ROLE = {
  [ROLES.Client]: [
    { to: '/slots', label: 'קביעת תור', icon: CalendarPlus },
    { to: '/appointments', label: 'התורים שלי', icon: CalendarDays },
  ],
  [ROLES.Therapist]: [
    { to: '/therapist/slots', label: 'ניהול חלונות', icon: CalendarPlus },
    { to: '/appointments', label: 'כל התורים', icon: ListChecks },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.brand}>
            <img src="/leaf.svg" alt="" width="32" height="32" />
            <span>מרחב שקט</span>
          </NavLink>

          <nav className={styles.nav} aria-label="ניווט ראשי">
            {NAV_BY_ROLE[user.role].map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                <Icon size={18} aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.user}>
            <span className={styles.userName}>שלום, {user.fullName.split(' ')[0]}</span>
            <button type="button" className={styles.logout} onClick={logout} aria-label="התנתקות">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
