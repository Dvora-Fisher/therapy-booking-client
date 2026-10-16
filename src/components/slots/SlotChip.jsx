import { formatTimeRange } from '../../utils/dates';
import styles from './SlotChip.module.css';

/** One time slot as a "chip": the hours, and the treatment types that can be booked in it. */
export default function SlotChip({ slot, onSelect, busy = false, children }) {
  const content = (
    <>
      <span className={styles.time}>{formatTimeRange(slot.startUtc, slot.endUtc)}</span>
      <span className={styles.tags}>
        {slot.treatmentTypes.map((t) => (
          <span key={t.id} className={styles.tag}>
            {t.name}
          </span>
        ))}
      </span>
    </>
  );

  // Clickable chip for clients; a plain chip with an actions slot for the therapist
  if (onSelect) {
    return (
      <button type="button" className={`${styles.chip} ${styles.clickable}`} onClick={() => onSelect(slot)}
        disabled={busy} aria-label={`קביעת תור ${formatTimeRange(slot.startUtc, slot.endUtc)}`}>
        {content}
      </button>
    );
  }

  return (
    <div className={styles.chip}>
      {content}
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}
