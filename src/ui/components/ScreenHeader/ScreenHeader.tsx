import styles from './ScreenHeader.module.scss';

interface Props {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
}

export function ScreenHeader({ title, onBack, onClose }: Props) {
  return (
    <header className={styles.header}>
      {onBack && (
        <button type="button" className={styles.back} aria-label="Назад" onClick={onBack}>
          ←
        </button>
      )}
      <h1 className={styles.title}>{title}</h1>
      {onClose && (
        <button type="button" className={styles.close} aria-label="Выйти" onClick={onClose}>
          ×
        </button>
      )}
    </header>
  );
}
