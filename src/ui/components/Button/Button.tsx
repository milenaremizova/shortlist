import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.scss';

type Variant = 'primary' | 'secondary' | 'dark';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary — главное действие экрана, secondary — второе на синем, dark — на светлой карточке или шторке. */
  variant?: Variant;
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: Props) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}
