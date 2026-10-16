import { HeartHandshake } from 'lucide-react';
import Button from '../Button';
import Modal from '../Modal';
import { EmptyState } from '../Feedback';
import { formatDay, formatTimeRange } from '../../utils/dates';
import styles from './ConflictModal.module.css';

/**
 * The 409 moment. Someone else booked this slot a moment earlier - this should feel cared for,
 * not like an error: a warm tone, a short explanation, and nearby slots that book in one tap.
 */
export default function ConflictModal({ conflict, onQuickBook, onClose, pendingSlotId }) {
  return (
    <Modal open={Boolean(conflict)} onClose={onClose} title="החלון נתפס ממש עכשיו" tone="warm"
      icon={<HeartHandshake size={22} />}>
      {conflict && (
        <>
          <p className={styles.message}>
            מטופל אחר הספיק לקבוע את השעה הזו שניות ספורות לפני כן. זה קורה, ויש עוד שעות טובות:
          </p>

          {conflict.alternatives.length === 0 ? (
            <EmptyState title="אין כרגע חלופות קרובות" text="אפשר לחזור לרשימה ולבחור יום אחר." />
          ) : (
            <ul className={styles.alternatives}>
              {conflict.alternatives.map((slot) => (
                <li key={slot.id} className={styles.alternative}>
                  <div>
                    <p className={styles.day}>{formatDay(slot.startUtc)}</p>
                    <p className={styles.time}>{formatTimeRange(slot.startUtc, slot.endUtc)}</p>
                  </div>
                  <Button size="sm" onClick={() => onQuickBook(slot, conflict.treatmentTypeId)}
                    loading={pendingSlotId === slot.id} disabled={pendingSlotId !== null}>
                    לקביעה מהירה
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <Button variant="ghost" onClick={onClose}>חזרה לכל החלונות</Button>
        </>
      )}
    </Modal>
  );
}
