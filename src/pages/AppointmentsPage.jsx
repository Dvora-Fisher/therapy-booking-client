import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarX2, Clock, UserRound } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import ConfirmModal from '../components/ConfirmModal';
import { EmptyState, ErrorNotice, Skeleton } from '../components/Feedback';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import { cancelAppointment, getAppointments } from '../api/appointments';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { formatDay, formatDayAndTime, formatTimeRange } from '../utils/dates';
import { APPOINTMENT_STATUS, ROLES } from '../utils/labels';
import styles from './AppointmentsPage.module.css';

const PAGE_SIZE = 10;
const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000; // mirrors Booking:CancellationWindowHours on the server

const VIEWS = {
  upcoming: { label: 'תורים קרובים', query: () => ({ status: 'Active', from: new Date().toISOString() }) },
  all: { label: 'כל התורים', query: () => ({}) },
};

/** "My appointments" for a client, "all appointments" for the therapist - the server decides which rows. */
export default function AppointmentsPage() {
  const { user } = useAuth();
  const isTherapist = user.role === ROLES.Therapist;
  const [view, setView] = useState('upcoming');
  const [page, setPage] = useState(1);
  const [toCancel, setToCancel] = useState(null);

  const appointments = useAsync(
    () => getAppointments({ ...VIEWS[view].query(), page, pageSize: PAGE_SIZE }),
    [view, page],
  );

  const changeView = (next) => {
    setView(next);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title={isTherapist ? 'כל התורים' : 'התורים שלי'}
        subtitle={isTherapist ? undefined : 'ביטול אפשרי עד 24 שעות לפני מועד התור.'}
      >
        <div className={styles.tabs} role="tablist" aria-label="סינון תורים">
          {Object.entries(VIEWS).map(([key, { label }]) => (
            <button key={key} type="button" role="tab" aria-selected={view === key}
              className={`${styles.tab} ${view === key ? styles.activeTab : ''}`} onClick={() => changeView(key)}>
              {label}
            </button>
          ))}
        </div>
      </PageHeader>

      {appointments.loading && <Skeleton lines={3} height={96} />}
      {appointments.error && <ErrorNotice message={appointments.error} onRetry={appointments.reload} />}
      {!appointments.loading && !appointments.error && appointments.data.items.length === 0 && (
        <EmptyState
          title={view === 'upcoming' ? 'אין תורים קרובים' : 'עוד אין תורים'}
          text={isTherapist ? 'תורים שייקבעו יופיעו כאן.' : 'כשיתאים לך, אפשר לבחור שעה פנויה.'}
          action={!isTherapist && <Link to="/slots">לקביעת תור</Link>}
        />
      )}

      {!appointments.loading && appointments.data?.items.length > 0 && (
        <>
          <ul className={styles.list}>
            {appointments.data.items.map((a) => (
              <li key={a.id}>
                <AppointmentCard appointment={a} isTherapist={isTherapist} onCancel={setToCancel} />
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={appointments.data.totalPages} onChange={setPage} />
        </>
      )}

      <ConfirmModal
        open={Boolean(toCancel)}
        title="לבטל את התור?"
        icon={<CalendarX2 size={22} />}
        confirmLabel="ביטול התור"
        keepLabel="השארת התור"
        successMessage="התור בוטל והשעה התפנתה"
        onConfirm={() => cancelAppointment(toCancel.id)}
        onDone={appointments.reload}
        onClose={() => setToCancel(null)}
      >
        {toCancel && (
          <>
            <p>
              {toCancel.treatmentTypeName} · {formatDayAndTime(toCancel.startUtc)}
              {isTherapist && ` · ${toCancel.clientFullName}`}
            </p>
            <p className={styles.muted}>השעה תשתחרר ותהיה זמינה לקביעה מחדש.</p>
          </>
        )}
      </ConfirmModal>
    </>
  );
}

function AppointmentCard({ appointment: a, isTherapist, onCancel }) {
  const status = APPOINTMENT_STATUS[a.status];
  const msUntilStart = new Date(a.startUtc) - Date.now();
  const canCancel = a.status === 'Active' && msUntilStart > 0;
  const tooLateForClient = !isTherapist && msUntilStart < CANCELLATION_WINDOW_MS;

  return (
    <Card as="article" className={styles.card}>
      <div className={styles.date}>
        <span className={styles.day}>{formatDay(a.startUtc)}</span>
        <span className={styles.time}>
          <Clock size={16} aria-hidden /> {formatTimeRange(a.startUtc, a.endUtc)}
        </span>
      </div>

      <div className={styles.details}>
        <p className={styles.type}>{a.treatmentTypeName}</p>
        {isTherapist && (
          <p className={styles.muted}>
            <UserRound size={14} aria-hidden /> {a.clientFullName}
          </p>
        )}
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      {canCancel && (
        <div className={styles.cancel}>
          <Button size="sm" variant="danger" onClick={() => onCancel(a)} disabled={tooLateForClient}>
            ביטול
          </Button>
          {tooLateForClient && <p className={styles.hint}>פחות מ-24 שעות לתור. לביטול יש לפנות למטפלת.</p>}
        </div>
      )}
    </Card>
  );
}
