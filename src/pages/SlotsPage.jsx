import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Button from '../components/Button';
import { EmptyState, ErrorNotice, Skeleton } from '../components/Feedback';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import BookingModal from '../components/slots/BookingModal';
import ConflictModal from '../components/slots/ConflictModal';
import SlotChip from '../components/slots/SlotChip';
import SlotFilters from '../components/slots/SlotFilters';
import SlotsByDay from '../components/slots/SlotsByDay';
import { getNextAvailableSlot, getSlots } from '../api/slots';
import { useAsync } from '../hooks/useAsync';
import { useBooking } from '../hooks/useBooking';
import { useTreatmentTypes } from '../hooks/useTreatmentTypes';
import { formatDayAndTime, todayInIsrael } from '../utils/dates';
import { buildSlotQuery } from '../utils/slotQuery';
import styles from './SlotsPage.module.css';

const PAGE_SIZE = 24;

/** Client home: browse open slots (server-side filtering and paging) and book one. */
export default function SlotsPage() {
  const navigate = useNavigate();
  const { treatmentTypes } = useTreatmentTypes();
  const [filters, setFilters] = useState({ from: todayInIsrael(), to: '', treatmentTypeId: '' });
  const [page, setPage] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slots = useAsync(() => getSlots(buildSlotQuery(filters, page, PAGE_SIZE)), [filters, page]);
  const nextAvailable = useAsync(
    () => getNextAvailableSlot(filters.treatmentTypeId || undefined).catch(() => null), // 404 = none
    [filters.treatmentTypeId],
  );

  const booking = useBooking({
    onBooked: () => {
      setSelectedSlot(null);
      navigate('/appointments');
    },
  });

  const changeFilters = (next) => {
    setFilters(next);
    setPage(1); // new filters start from the first page
  };

  // Booking that failed with 409 closes the confirm dialog; the conflict dialog takes over
  const confirmBooking = async (slot, typeId) => {
    const booked = await booking.book(slot, typeId);
    if (!booked) {
      setSelectedSlot(null);
      slots.reload();
    }
  };

  return (
    <>
      <PageHeader title="קביעת תור" subtitle="בחרו שעה שנוחה לכם. השעות מוצגות לפי שעון ישראל." />

      {nextAvailable.data && (
        <div className={styles.next}>
          <Sparkles size={20} aria-hidden className={styles.nextIcon} />
          <p>
            <span className={styles.nextLabel}>השעה הפנויה הקרובה: </span>
            <strong>{formatDayAndTime(nextAvailable.data.startUtc)}</strong>
          </p>
          <Button size="sm" variant="secondary" onClick={() => setSelectedSlot(nextAvailable.data)}>
            לקביעה
          </Button>
        </div>
      )}

      <SlotFilters filters={filters} onChange={changeFilters} treatmentTypes={treatmentTypes} />

      {slots.loading && <Skeleton lines={4} height={72} />}
      {slots.error && <ErrorNotice message={slots.error} onRetry={slots.reload} />}
      {!slots.loading && !slots.error && slots.data.items.length === 0 && (
        <EmptyState title="אין חלונות פנויים בטווח הזה" text="נסו טווח תאריכים רחב יותר או סוג טיפול אחר." />
      )}
      {!slots.loading && slots.data?.items.length > 0 && (
        <>
          <SlotsByDay
            slots={slots.data.items}
            renderSlot={(slot) => (
              <SlotChip slot={slot} onSelect={setSelectedSlot} busy={booking.pendingSlotId === slot.id} />
            )}
          />
          <Pagination page={page} totalPages={slots.data.totalPages} onChange={setPage} />
        </>
      )}

      <BookingModal
        key={selectedSlot?.id}
        slot={selectedSlot}
        preferredTypeId={filters.treatmentTypeId}
        busy={booking.pendingSlotId !== null}
        onConfirm={confirmBooking}
        onClose={() => setSelectedSlot(null)}
      />

      <ConflictModal
        conflict={booking.conflict}
        pendingSlotId={booking.pendingSlotId}
        onQuickBook={booking.book}
        onClose={booking.clearConflict}
      />
    </>
  );
}
