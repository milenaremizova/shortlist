import { NavLink } from 'react-router';

import styles from './BottomNav.module.scss';

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Основная навигация">
      <NavLink to="/home" className={linkClass}>
        Главная
      </NavLink>
      <NavLink to="/history" className={linkClass}>
        История
      </NavLink>
    </nav>
  );
}

function linkClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}
