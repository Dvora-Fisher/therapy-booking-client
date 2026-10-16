import { Link } from 'react-router-dom';
import { EmptyState } from '../components/Feedback';

export default function NotFoundPage() {
  return (
    <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
      <EmptyState title="הדף לא נמצא" text="ייתכן שהקישור השתנה." action={<Link to="/">חזרה לדף הבית</Link>} />
    </main>
  );
}
