import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import Button from '../Button';
import Modal from '../Modal';
import { formatDay, formatTimeRange } from '../../utils/dates';
import styles from './BookingModal.module.css';

/** Confirms a booking: shows the time and lets the client pick one of the slot's treatment types. */
export default function BookingModal({ slot, preferredTypeId, onConfirm, onClose, busy }) {
  const initialType = slot?.treatmentTypes.find((t) => String(t.id) === String(preferredTypeId)) ?? slot?.treatmentTypes[0];
  const [typeId, setTypeId] = useState(initialType?.id);

  return (
    <Modal open={Boolean(slot)} onClose={onClose} title="קביעת תור" icon={<CalendarCheck size={22} />}>
      {slot && (
        <>
          <div className={styles.when}>
            <span className={styles.day}>{formatDay(slot.startUtc)}</span>
            <span className={styles.time}>{formatTimeRange(slot.startUtc, slot.endUtc)}</span>
          </div>

          <fieldset className={styles.types}>
            <legend>סוג הטיפול</legend>
            {slot.treatmentTypes.map((t) => (
              <label key={t.id} className={`${styles.option} ${typeId === t.id ? styles.selected : ''}`}>
                <input type="radio" name="treatmentType" value={t.id} checked={typeId === t.id}
                  onChange={() => setTypeId(t.id)} />
                {t.name}
              </label>
            ))}
          </fieldset>

          <p className={styles.policy}>אפשר לבטל עד 24 שעות לפני מועד התור.</p>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={onClose} disabled={busy}>חזרה</Button>
            <Button onClick={() => onConfirm(slot, typeId)} loading={busy}>אישור וקביעה</Button>
          </div>
        </>
      )}
    </Modal>
  );
}
