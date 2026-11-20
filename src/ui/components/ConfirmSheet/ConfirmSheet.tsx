import { useEffect, useRef } from 'react';

import { Button } from '@/ui/components/Button/Button';

import styles from './ConfirmSheet.module.scss';

interface Props {
  title: string;
  text?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({
  title,
  text,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.sheet}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <h2 id="confirm-title" className={styles.title}>
        {title}
      </h2>
      {text && <p className={styles.text}>{text}</p>}
      <div className={styles.actions}>
        <Button variant="dark" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </dialog>
  );
}
