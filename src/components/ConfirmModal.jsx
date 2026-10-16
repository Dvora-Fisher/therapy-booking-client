import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';
import Modal from './Modal';
import { getErrorMessage } from '../utils/errors';
import styles from './ConfirmModal.module.css';

/**
 * "Are you sure?" for irreversible actions (cancel an appointment, delete a slot).
 * Runs `onConfirm`, shows a success toast or the server's error, and closes on success.
 */
export default function ConfirmModal({ open, title, children, confirmLabel, keepLabel = 'חזרה', successMessage,
  onConfirm, onDone, onClose, icon = <AlertCircle size={22} /> }) {
  const [running, setRunning] = useState(false);

  async function confirm() {
    setRunning(true);
    try {
      await onConfirm();
      toast.success(successMessage);
      onClose();
      onDone?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRunning(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title} icon={icon} tone="warm">
      <div className={styles.body}>{children}</div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose} disabled={running}>{keepLabel}</Button>
        <Button variant="danger" onClick={confirm} loading={running}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
