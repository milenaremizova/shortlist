import type { ReactNode } from 'react';

import { Tapochka } from '../Tapochka/Tapochka';
import styles from './ScreenStub.module.scss';

interface Props {
  code: string;
  title: string;
  children?: ReactNode;
}

export function ScreenStub({ code, title, children }: Props) {
  return (
    <main className={styles.screen}>
      <p className={styles.code}>{code} · в работе</p>
      <h1 className={styles.title}>{title}</h1>
      <Tapochka palette="butter" size={160} />
      {children}
    </main>
  );
}
