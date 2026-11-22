import starIcon from '@/ui/assets/icons/start-icon.svg';

import styles from './Separator.module.scss';

export function Separator() {
  return <img className={styles.separator} src={starIcon} alt="" width={12} height={12} />;
}
