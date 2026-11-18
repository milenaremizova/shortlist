import { useEffect, useState } from 'react';

import styles from './HistoryPage.module.scss';

type DeleteStatus = 'idle' | 'confirm' | 'deleting' | 'error';

const LABEL: Record<DeleteStatus, string> = {
  idle: 'Удалить',
  confirm: 'Точно удалить?',
  deleting: 'Удаляю…',
  error: 'Не удалось удалить',
};

interface Props {
  onDelete: () => Promise<void>;
}

export function DeleteEntryButton({ onDelete }: Props) {
  const [status, setStatus] = useState<DeleteStatus>('idle');

  async function handleClick() {
    if (status === 'idle' || status === 'error') {
      setStatus('confirm');
      return;
    }
    setStatus('deleting');
    try {
      await onDelete();
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }

  useEffect(() => {
    if (status !== 'confirm') return;
    const timer = setTimeout(() => {
      setStatus('idle');
    }, 3000);

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <button
      type="button"
      className={status === 'confirm' ? `${styles.delete} ${styles.deleteConfirm}` : styles.delete}
      disabled={status === 'deleting'}
      onClick={handleClick}
    >
      {LABEL[status]}
    </button>
  );
}
