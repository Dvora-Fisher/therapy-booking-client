import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

// Page numbers to show: first, last, and up to two neighbours of the current page ("…" for gaps)
function pageItems(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['gap-' + p, p] : [p]));
}

/** Server-side pagination control. In RTL "previous" points right and "next" points left. */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="ניווט בין עמודים">
      <button type="button" className={styles.step} onClick={() => onChange(page - 1)} disabled={page <= 1}>
        <ChevronRight size={18} aria-hidden />
        <span>הקודם</span>
      </button>

      <ol className={styles.pages}>
        {pageItems(page, totalPages).map((item) =>
          typeof item === 'string' ? (
            <li key={item} className={styles.gap} aria-hidden>
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={`${styles.page} ${item === page ? styles.current : ''}`}
                onClick={() => onChange(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`עמוד ${item}`}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ol>

      <button type="button" className={styles.step} onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        <span>הבא</span>
        <ChevronLeft size={18} aria-hidden />
      </button>
    </nav>
  );
}
