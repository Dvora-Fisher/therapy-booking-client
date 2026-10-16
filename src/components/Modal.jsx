import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

/**
 * Built on the native <dialog>: showModal() gives focus trapping, Esc to close and a backdrop for free.
 */
export default function Modal({ open, onClose, title, icon, tone = 'default', children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // A click on the backdrop (outside the content box) closes the dialog
  const handleClick = (event) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog ref={dialogRef} className={`${styles.dialog} ${styles[tone]}`} onClose={onClose} onClick={handleClick}>
      <div className={styles.content}>
        <header className={styles.header}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="סגירה">
            <X size={20} />
          </button>
        </header>
        {open && children}
      </div>
    </dialog>
  );
}
