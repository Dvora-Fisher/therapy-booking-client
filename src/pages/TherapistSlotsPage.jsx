import { useState } from 'react';
import toast from 'react-hot-toast';
import { Ban, CalendarPlus, LockOpen, Trash2, UserRound } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import ConfirmModal from '../components/ConfirmModal';
import DateField from '../components/DateField';
import { EmptyState, ErrorNotice, Skeleton } from '../components/Feedback';
import FormField from '../components/FormField';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import SlotChip from '../components/slots/SlotChip';
import SlotFilters from '../components/slots/SlotFilters';
import SlotsByDay from '../components/slots/SlotsByDay';
import { createSlot, deleteSlot, getSlots, updateSlot } from '../api/slots';
import { useAsync } from '../hooks/useAsync';
import { useTreatmentTypes } from '../hooks/useTreatmentTypes';
import {
  formatDayAndTime, israelTimeToUtcIso, nextWeekdayAfter, overlapsShabbat, SHABBAT, todayInIsrael,
} from '../utils/dates';
import { getErrorMessage, getFieldErrors } from '../utils/errors';
import { SLOT_STATUS } from '../utils/labels';
import { buildSlotQuery } from '../utils/slotQuery';
import styles from './TherapistSlotsPage.module.css';

const PAGE_SIZE = 30;

/** Therapist: publish new slots and manage existing ones (block / reopen / delete). */
export default function TherapistSlotsPage() {
  const { treatmentTypes } = useTreatmentTypes();
  const [filters, setFilters] = useState({ from: todayInIsrael(), to: '', treatmentTypeId: '', status: '' });
  const [page, setPage] = useState(1);
  const [busySlotId, setBusySlotId] = useState(null);
  const [slotToDelete, setSlotToDelete] = useState(null);

  const slots = useAsync(() => getSlots(buildSlotQuery(filters, page, PAGE_SIZE)), [filters, page]);

  // Shared by block / reopen: run the request, show the outcome, refresh the list
  async function runSlotAction(slot, request, successMessage) {
    setBusySlotId(slot.id);
    try {
      await request();
      toast.success(successMessage);
      slots.reload();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusySlotId(null);
    }
  }

  const setStatus = (slot, status) =>
    runSlotAction(
      slot,
      () => updateSlot(slot.id, {
        startUtc: slot.startUtc,
        endUtc: slot.endUtc,
        treatmentTypeIds: slot.treatmentTypes.map((t) => t.id),
        status,
      }),
      status === 'Blocked' ? 'החלון נחסם' : 'החלון נפתח לקביעה',
    );

  return (
    <>
      <PageHeader title="ניהול חלונות" subtitle="פרסום שעות פנויות וניהול הקיימות. השעות לפי שעון ישראל." />

      <NewSlotForm treatmentTypes={treatmentTypes} onCreated={slots.reload} />

      <h2 className={styles.sectionTitle}>חלונות קיימים</h2>
      <SlotFilters filters={filters} treatmentTypes={treatmentTypes}
        onChange={(next) => { setFilters(next); setPage(1); }}>
        <FormField label="סטטוס" as="select" value={filters.status}
          onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}>
          <option value="">הכול</option>
          {Object.entries(SLOT_STATUS).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </FormField>
      </SlotFilters>

      {slots.loading && <Skeleton lines={3} height={110} />}
      {slots.error && <ErrorNotice message={slots.error} onRetry={slots.reload} />}
      {!slots.loading && !slots.error && slots.data.items.length === 0 && (
        <EmptyState title="אין חלונות בטווח הזה" text="אפשר לפרסם חלון חדש בטופס שלמעלה." />
      )}
      {!slots.loading && slots.data?.items.length > 0 && (
        <>
          <SlotsByDay
            slots={slots.data.items}
            renderSlot={(slot) => {
              const status = SLOT_STATUS[slot.status];
              const busy = busySlotId === slot.id;
              return (
                <SlotChip slot={slot}>
                  <Badge tone={status.tone}>{status.label}</Badge>
                  {slot.bookedByClientName && (
                    <span className={styles.bookedBy}>
                      <UserRound size={14} aria-hidden /> {slot.bookedByClientName}
                    </span>
                  )}
                  {slot.status === 'Open' && (
                    <Button size="sm" variant="ghost" icon={Ban} loading={busy} onClick={() => setStatus(slot, 'Blocked')}>
                      חסימה
                    </Button>
                  )}
                  {slot.status === 'Blocked' && (
                    <Button size="sm" variant="ghost" icon={LockOpen} loading={busy} onClick={() => setStatus(slot, 'Open')}>
                      פתיחה
                    </Button>
                  )}
                  {slot.status !== 'Booked' && (
                    <Button size="sm" variant="ghost" icon={Trash2} disabled={busy} aria-label="מחיקת החלון"
                      onClick={() => setSlotToDelete(slot)} />
                  )}
                </SlotChip>
              );
            }}
          />
          <Pagination page={page} totalPages={slots.data.totalPages} onChange={setPage} />
        </>
      )}

      <ConfirmModal
        open={Boolean(slotToDelete)}
        title="למחוק את החלון?"
        icon={<Trash2 size={22} />}
        confirmLabel="מחיקה"
        successMessage="החלון נמחק"
        onConfirm={() => deleteSlot(slotToDelete.id)}
        onDone={slots.reload}
        onClose={() => setSlotToDelete(null)}
      >
        {slotToDelete && <p>{formatDayAndTime(slotToDelete.startUtc)}. מחיקה אינה הפיכה.</p>}
      </ConfirmModal>
    </>
  );
}

function NewSlotForm({ treatmentTypes, onCreated }) {
  const [form, setForm] = useState({ date: nextWeekdayAfter(todayInIsrael()), start: '09:00', end: '10:00', typeIds: [] });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));
  const onShabbat = overlapsShabbat(form.date, form.start, form.end);
  const toggleType = (id) =>
    setForm((f) => ({ ...f, typeIds: f.typeIds.includes(id) ? f.typeIds.filter((x) => x !== id) : [...f.typeIds, id] }));

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      await createSlot({
        startUtc: israelTimeToUtcIso(form.date, form.start),
        endUtc: israelTimeToUtcIso(form.date, form.end),
        treatmentTypeIds: form.typeIds,
      });
      toast.success('החלון פורסם');
      setForm((f) => ({ ...f, start: f.end, end: '' })); // ready for the next slot right after
      onCreated();
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className={styles.formCard}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.formTitle}>חלון חדש</h2>
        <div className={styles.row}>
          <DateField label="תאריך" value={form.date} min={todayInIsrael()} onChange={set('date')} required
            error={onShabbat
              ? `שבת: לא מפרסמים חלונות מיום שישי ${SHABBAT.startsOnFridayAt} עד מוצאי שבת ${SHABBAT.endsOnSaturdayAt}.`
              : undefined} />
          <FormField label="משעה" type="time" value={form.start} onChange={set('start')} required />
          <FormField label="עד שעה" type="time" value={form.end} onChange={set('end')} error={errors.endUtc} required />
        </div>

        <fieldset className={styles.types}>
          <legend>סוגי טיפול שאפשר לקבוע בחלון</legend>
          {treatmentTypes.map((t) => (
            <label key={t.id} className={`${styles.type} ${form.typeIds.includes(t.id) ? styles.typeOn : ''}`}>
              <input type="checkbox" checked={form.typeIds.includes(t.id)} onChange={() => toggleType(t.id)} />
              {t.name}
            </label>
          ))}
          {errors.treatmentTypeIds && <p className={styles.error} role="alert">יש לבחור לפחות סוג טיפול אחד.</p>}
        </fieldset>

        <Button type="submit" icon={CalendarPlus} loading={saving} disabled={onShabbat} className={styles.submit}>
          פרסום החלון
        </Button>
      </form>
    </Card>
  );
}
