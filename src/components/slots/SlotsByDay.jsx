import { groupByIsraelDay } from '../../utils/dates';
import styles from './SlotsByDay.module.css';

/** Slots grouped under a heading per Israel day ("יום שלישי, 20 באוקטובר"). */
export default function SlotsByDay({ slots, renderSlot }) {
  return (
    <div className={styles.days}>
      {groupByIsraelDay(slots, (s) => s.startUtc).map((day) => (
        <section key={day.key} className={styles.day} aria-labelledby={`day-${day.key}`}>
          <h3 id={`day-${day.key}`} className={styles.dayTitle}>
            {day.label}
          </h3>
          <ul className={styles.grid}>
            {day.items.map((slot) => (
              <li key={slot.id}>{renderSlot(slot)}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
