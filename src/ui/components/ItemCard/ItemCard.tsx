import type { Item } from '@/domain/types';

import styles from './ItemCard.module.scss';

interface Props {
  item: Item;
  onClick: () => void;
}

/** Карточка варианта для экранов выбора: сравнение, вечер, дуэль. */
export function ItemCard({ item, onClick }: Props) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt="" className={styles.image} />
      ) : (
        <span className={styles.placeholder} aria-hidden="true"></span>
      )}
      <span className={styles.body}>
        {item.tag && <span className={styles.tag}>{item.tag}</span>}
        <span className={styles.title}>{item.title}</span>
        {item.meta && <span className={styles.meta}>{item.meta}</span>}
        {item.description && <span className={styles.description}>{item.description}</span>}
      </span>
    </button>
  );
}
