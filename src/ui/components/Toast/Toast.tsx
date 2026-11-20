import type { ReactNode } from 'react';

import styles from './Toast.module.scss';

interface Props {
  children: ReactNode;
  icon?: ReactNode;
}

export function Toast({ children, icon }: Props) {
  return (
    <div className={styles.toast} role="status">
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </div>
  );
}
