import styles from './Avatar.module.scss';

interface Props {
  initial: string;
  /** muted для того, кто ещё не пришёл или ходит вторым. */
  tone?: 'accent' | 'warm' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** кружок с буквой: аватар игрока. когда появятся фото профиля, то будет замена на содержимое. */
export function Avatar({ initial, tone = 'accent', size = 'md', className }: Props) {
  const classes = [styles.avatar, styles[tone], styles[size], className].filter(Boolean).join(' ');
  return (
    <span className={classes} aria-hidden="true">
      {initial}
    </span>
  );
}
